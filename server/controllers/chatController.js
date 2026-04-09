const Conversation = require("../models/Conversation");
const Lead = require("../models/Lead");
const Meeting = require("../models/Meeting");

const extractStudentDataLLM = require("../services/extractStudentDataLLM");
const findKnowledgeAnswer = require("../services/findKnowledgeAnswer");
const generateCounsellorReplyLLM = require("../services/generateCounsellorReplyLLM");

const getMissingFields = require("../utils/getMissingFields");
const mergeExtractedData = require("../utils/mergeExtractedData");
const calculateLeadScore = require("../utils/calculateLeadScore");
const recommendUniversities = require("../utils/recommendUniversities");
const recommendUniversitiesAdvanced = require("../utils/recommendUniversitiesAdvanced");

function emitLiveActivity(io, conversation) {
  io.to("admin-live-activity").emit("live-activity-update", {
    _id: conversation._id,
    callId: conversation.callId || "",
    conversationId: conversation._id,
    channel: conversation.channel,
    liveStatus: conversation.liveStatus,
    status: conversation.status,
    studentName: conversation.extractedData?.name || "Unknown Student",
    phone: conversation.extractedData?.phone || "",
    email: conversation.extractedData?.email || "",
    messages: conversation.messages || [],
    latestMessage:
      conversation.messages?.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : null,
    updatedAt: conversation.updatedAt,
  });
}

const startConversation = async (req, res) => {
  try {
    const now = new Date();

    const conversation = await Conversation.create({
      studentId: req.user.id,
      channel: "chat",
      liveStatus: "ongoing",
      callStartedAt: now,
      lastLiveAt: now,
      preferredLanguage: "",
      lastAskedField: "",
      askedFields: [],
      messages: [
        {
          sender: "ai",
          text: "Hi! I'm your AI counsellor from Fateh Education 😊\nI’ll help you with studying abroad.\n\nWhich language would you prefer for our conversation: English, Hindi, or Marathi?",
        },
      ],
      extractedData: {
        name: "",
        phone: "",
        email: "",
        location: "",
        education_level: "",
        field: "",
        institution: "",
        gpa_percentage: "",
        target_countries: [],
        course_interest: "",
        intake_timing: "",
        test_status: "",
        test_score: "",
        budget_range: "",
        scholarship_interest: "",
        application_timeline: "",
        concerns: "",
        interestQuestionCount: 0,
        sentiment: "neutral",
      },
      status: "active",
    });

    const io = req.app.get("io");
    emitLiveActivity(io, conversation);

    return res.status(201).json(conversation);
  } catch (error) {
    console.error("startConversation error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message || !message.trim()) {
      return res.status(400).json({
        message: "Conversation ID and message are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const cleanMessage = message.trim();

    conversation.channel = "chat";
    conversation.liveStatus = "ongoing";
    conversation.lastLiveAt = new Date();
    if (!conversation.callStartedAt) {
      conversation.callStartedAt = new Date();
    }

    conversation.messages.push({
      sender: "student",
      text: cleanMessage,
    });

    if (!conversation.preferredLanguage) {
      const lower = cleanMessage.toLowerCase();

      if (lower.includes("hindi")) {
        conversation.preferredLanguage = "hindi";
      } else if (lower.includes("marathi")) {
        conversation.preferredLanguage = "marathi";
      } else {
        conversation.preferredLanguage = "english";
      }

      const firstFollowUp =
        conversation.preferredLanguage === "hindi"
          ? "Great! Main Hindi mein continue karta hoon. Aap kis course ya country mein interest rakhte ho?"
          : conversation.preferredLanguage === "marathi"
          ? "Chhan! Mi Marathi madhye continue karto. Tumhala kontya course kiwa country madhye interest aahe?"
          : "Great! I’ll continue in English. Can I know what course or country you’re interested in?";

      conversation.messages.push({
        sender: "ai",
        text: firstFollowUp,
      });

      await conversation.save();

      const io = req.app.get("io");
      emitLiveActivity(io, conversation);

      return res.json(conversation);
    }

    const extracted = await extractStudentDataLLM({
      latestMessage: cleanMessage,
      existingData: conversation.extractedData,
      lastAskedField: conversation.lastAskedField || "",
      preferredLanguage: conversation.preferredLanguage,
    });

    conversation.extractedData = mergeExtractedData(
      conversation.extractedData,
      extracted
    );

    const missingFields = getMissingFields(conversation.extractedData);
    const knowledgeAnswer = await findKnowledgeAnswer(cleanMessage);

    const aiReply = await generateCounsellorReplyLLM({
      preferredLanguage: conversation.preferredLanguage,
      transcript: conversation.messages,
      extractedData: conversation.extractedData,
      missingFields,
      knowledgeAnswer,
    });

    conversation.lastAskedField = missingFields[0] || "";

    if (
      conversation.lastAskedField &&
      !conversation.askedFields.includes(conversation.lastAskedField)
    ) {
      conversation.askedFields.push(conversation.lastAskedField);
    }

    conversation.messages.push({
      sender: "ai",
      text: aiReply,
    });

    await conversation.save();

    const io = req.app.get("io");
    emitLiveActivity(io, conversation);

    return res.json(conversation);
  } catch (error) {
    console.error("sendMessage error:", error);

    const status = error?.status || 500;
    const rawMessage = error?.message || "Something went wrong";

    if (status === 503 || rawMessage.includes("high demand")) {
      return res.status(503).json({
        message:
          "The AI service is busy right now. Please wait a few seconds and try again.",
      });
    }

    return res.status(500).json({
      message: rawMessage,
    });
  }
};

const finalizeConversation = async (req, res) => {
  try {
    const { conversationId, callbackRequested } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const data = conversation.extractedData;
    const scoreData = calculateLeadScore(data);
    const recommendation = recommendUniversities(data);
    const topUniversityObjects = await recommendUniversitiesAdvanced(data);

    const summary = `
${data.name || "Student"} is interested in ${
      data.course_interest || "a course"
    } in ${data.target_countries?.join(", ") || "their preferred country"}.
Current education: ${data.education_level || "Not provided"}.
Field: ${data.field || "Not provided"}.
Institution: ${data.institution || "Not provided"}.
GPA/Percentage: ${data.gpa_percentage || "Not provided"}.
Test status: ${data.test_status || "Not provided"}.
Budget: ${data.budget_range || "Not provided"}.
Timeline: ${data.application_timeline || data.intake_timing || "Not provided"}.
Concerns: ${data.concerns || "None specified"}.
    `.trim();

    const lead = await Lead.create({
      studentId: conversation.studentId,
      conversationId: conversation._id,

      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      location: data.location || "",

      education_level: data.education_level || "",
      field: data.field || "",
      institution: data.institution || "",
      gpa_percentage: data.gpa_percentage || "",

      target_countries: data.target_countries || [],
      course_interest: data.course_interest || "",
      intake_timing: data.intake_timing || "",

      test_status: data.test_status || "",
      test_score: data.test_score || "",

      budget_range: data.budget_range || "",
      scholarship_interest: data.scholarship_interest || "",

      application_timeline: data.application_timeline || "",
      concerns: data.concerns || "",

      interestQuestionCount: data.interestQuestionCount || 0,
      sentiment: data.sentiment || "neutral",

      summary,
      leadScore: scoreData.total,
      leadCategory: scoreData.category,
      recommendedAction: scoreData.recommendedAction,
      recommendedCountry:
        topUniversityObjects[0]?.country ||
        recommendation.recommendedCountry ||
        "",
      topUniversities: topUniversityObjects.map((u) => u.name).filter(Boolean),
      recommendedUniversitiesDetailed: topUniversityObjects.filter(
        (u) => u && u.name
      ),
      callbackRequested: callbackRequested || false,
      callStatus: "completed",
      priorityScore: scoreData.total,
    });

    conversation.status = "completed";
    conversation.liveStatus = "ended";
    conversation.callEndedAt = new Date();
    conversation.lastLiveAt = new Date();
    await conversation.save();

    const io = req.app.get("io");
    emitLiveActivity(io, conversation);

    return res.json(lead);
  } catch (error) {
    console.error("finalizeConversation error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getStudentReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!lead.studentId || lead.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const meeting = await Meeting.findOne({ leadId: lead._id }).sort({
      createdAt: -1,
    });

    return res.json({
      summary: lead.summary,
      studentDetails: {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        location: lead.location,
        education_level: lead.education_level,
        field: lead.field,
        institution: lead.institution,
        gpa_percentage: lead.gpa_percentage,
        target_countries: lead.target_countries || [],
        course_interest: lead.course_interest,
        intake_timing: lead.intake_timing,
        test_status: lead.test_status,
        test_score: lead.test_score,
        budget_range: lead.budget_range,
        scholarship_interest: lead.scholarship_interest,
        application_timeline: lead.application_timeline,
        concerns: lead.concerns,
        topUniversities: lead.topUniversities || [],
        recommendedUniversitiesDetailed:
          lead.recommendedUniversitiesDetailed || [],
        recommendedCountry: lead.recommendedCountry || "",
      },
      nextSteps: lead.recommendedAction,
      booking: meeting
        ? {
            scheduled: true,
            date: meeting.date,
            time: meeting.time,
            mode: meeting.mode,
            meetingLink: meeting.meetingLink,
            status: meeting.status,
          }
        : {
            scheduled: false,
            bookingLink: "/student/book-demo",
          },
    });
  } catch (error) {
    console.error("getStudentReportById error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getStudentHistory = async (req, res) => {
  try {
    const leads = await Lead.find({ studentId: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "summary course_interest target_countries intake_timing recommendedCountry topUniversities recommendedUniversitiesDetailed createdAt"
      );

    const meetings = await Meeting.find({}).sort({ createdAt: -1 });

    const history = leads.map((lead) => {
      const meeting = meetings.find(
        (m) => m.leadId.toString() === lead._id.toString()
      );

      return {
        _id: lead._id,
        summary: lead.summary,
        course_interest: lead.course_interest,
        target_countries: lead.target_countries,
        intake_timing: lead.intake_timing,
        recommendedCountry: lead.recommendedCountry,
        topUniversities: lead.topUniversities || [],
        recommendedUniversitiesDetailed:
          lead.recommendedUniversitiesDetailed || [],
        createdAt: lead.createdAt,
        meeting: meeting
          ? {
              scheduled: true,
              date: meeting.date,
              time: meeting.time,
              mode: meeting.mode,
              meetingLink: meeting.meetingLink,
              status: meeting.status,
            }
          : {
              scheduled: false,
            },
      };
    });

    return res.json(history);
  } catch (error) {
    console.error("getStudentHistory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startConversation,
  sendMessage,
  finalizeConversation,
  getStudentReportById,
  getStudentHistory,
};