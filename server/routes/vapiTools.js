const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Lead = require("../models/Lead");
const findKnowledgeAnswer = require("../services/findKnowledgeAnswer");
const normalizeLeadData = require("../utils/normalizeLeadData");
const mergeExtractedData = require("../utils/mergeExtractedData");
const getMissingFields = require("../utils/getMissingFields");
const calculateLeadScore = require("../utils/calculateLeadScore");
const recommendUniversities = require("../utils/recommendUniversities");
const recommendUniversitiesAdvanced = require("../utils/recommendUniversitiesAdvanced");

function buildSummary(data = {}) {
  return `
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
}

function computePriorityScore(lead) {
  let priority = lead.leadScore || 0;

  if (lead.callStatus === "completed") priority += 10;
  if (lead.sentiment === "interested") priority += 5;
  if (lead.sentiment === "low_intent") priority -= 5;

  return priority;
}

// SAVE LEAD TOOL
router.post("/save-lead", async (req, res) => {
  try {
    console.log("save-lead body:", req.body);

    const incoming = normalizeLeadData(req.body || {});
    const { callId } = incoming;

    let conversation = await Conversation.findOne({ callId });

    if (!conversation) {
      conversation = await Conversation.create({
        callId,
        studentId: null,
        preferredLanguage: "",
        lastAskedField: "",
        askedFields: [],
        messages: [],
        extractedData: {},
        status: "active",
      });
    }

    conversation.extractedData = mergeExtractedData(
      conversation.extractedData || {},
      incoming
    );

    console.log("Merged extractedData:", conversation.extractedData);

    await conversation.save();

    let lead = await Lead.findOne({ conversationId: conversation._id });

    if (!lead) {
      const scoreData = calculateLeadScore(conversation.extractedData || {});
      const recommendation = recommendUniversities(
        conversation.extractedData || {}
      );

      const partialLeadScore = Math.min(scoreData.total || 0, 39);

      lead = await Lead.create({
        studentId: null,
        conversationId: conversation._id,
        name: conversation.extractedData.name || "",
        phone: conversation.extractedData.phone || "",
        email: conversation.extractedData.email || "",
        location: conversation.extractedData.location || "",
        education_level: conversation.extractedData.education_level || "",
        field: conversation.extractedData.field || "",
        institution: conversation.extractedData.institution || "",
        gpa_percentage: conversation.extractedData.gpa_percentage || "",
        target_countries: conversation.extractedData.target_countries || [],
        course_interest: conversation.extractedData.course_interest || "",
        intake_timing: conversation.extractedData.intake_timing || "",
        test_status: conversation.extractedData.test_status || "",
        test_score: conversation.extractedData.test_score || "",
        budget_range: conversation.extractedData.budget_range || "",
        scholarship_interest:
          conversation.extractedData.scholarship_interest || "",
        application_timeline:
          conversation.extractedData.application_timeline || "",
        concerns: conversation.extractedData.concerns || "",
        interestQuestionCount:
          conversation.extractedData.interestQuestionCount || 0,
        sentiment: conversation.extractedData.sentiment || "neutral",
        summary: "Partial voice call lead",
        leadScore: partialLeadScore,
        leadCategory: "Cold",
        recommendedAction: "Call ended early. Review partial details.",
        recommendedCountry: recommendation.recommendedCountry || "",
        topUniversities: recommendation.topUniversities || [],
        callbackRequested: false,
        callStatus: "partial",
        priorityScore: computePriorityScore({
          leadScore: partialLeadScore,
          callStatus: "partial",
          sentiment: conversation.extractedData.sentiment || "neutral",
        }),
      });
    } else {
      lead.name = conversation.extractedData.name || lead.name;
      lead.phone = conversation.extractedData.phone || lead.phone;
      lead.email = conversation.extractedData.email || lead.email;
      lead.location = conversation.extractedData.location || lead.location;
      lead.education_level =
        conversation.extractedData.education_level || lead.education_level;
      lead.field = conversation.extractedData.field || lead.field;
      lead.institution =
        conversation.extractedData.institution || lead.institution;
      lead.gpa_percentage =
        conversation.extractedData.gpa_percentage || lead.gpa_percentage;
      lead.target_countries =
        conversation.extractedData.target_countries || lead.target_countries;
      lead.course_interest =
        conversation.extractedData.course_interest || lead.course_interest;
      lead.intake_timing =
        conversation.extractedData.intake_timing || lead.intake_timing;
      lead.test_status =
        conversation.extractedData.test_status || lead.test_status;
      lead.test_score = conversation.extractedData.test_score || lead.test_score;
      lead.budget_range =
        conversation.extractedData.budget_range || lead.budget_range;
      lead.scholarship_interest =
        conversation.extractedData.scholarship_interest ||
        lead.scholarship_interest;
      lead.application_timeline =
        conversation.extractedData.application_timeline ||
        lead.application_timeline;
      lead.concerns = conversation.extractedData.concerns || lead.concerns;
      lead.interestQuestionCount =
        conversation.extractedData.interestQuestionCount || 0;
      lead.sentiment = conversation.extractedData.sentiment || "neutral";

      const partialScore = calculateLeadScore(conversation.extractedData || {});
      const partialRecommendation = recommendUniversities(
        conversation.extractedData || {}
      );

      lead.leadScore = Math.min(partialScore.total || 0, 39);
      lead.leadCategory = "Cold";
      lead.recommendedAction = "Call ended early. Review partial details.";
      lead.recommendedCountry = partialRecommendation.recommendedCountry || "";
      lead.topUniversities = partialRecommendation.topUniversities || [];
      lead.callStatus = "partial";
      lead.priorityScore = computePriorityScore(lead);

      await lead.save();
    }

    return res.json({
      success: true,
      message: "Lead data saved successfully",
      callId,
      conversationId: conversation._id,
      missingFields: getMissingFields(conversation.extractedData),
    });
  } catch (error) {
    console.error("save-lead error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// KNOWLEDGE ANSWER TOOL
router.post("/knowledge-answer", async (req, res) => {
  try {
    console.log("knowledge-answer body:", req.body);

    const { question } = req.body || {};

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    const answer = await findKnowledgeAnswer(question);

    return res.json({
      success: true,
      answer:
        answer?.answer || "A counsellor will guide you on this in more detail.",
    });
  } catch (error) {
    console.error("knowledge-answer error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// FINALIZE LEAD TOOL
router.post("/finalize-lead", async (req, res) => {
  try {
    console.log("finalize-lead body:", req.body);

    const raw = req.body || {};
    const callId = raw.callId || raw.callid;

    if (!callId) {
      return res.status(400).json({
        success: false,
        message: "callId is required",
      });
    }

    const conversation = await Conversation.findOne({ callId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const data = conversation.extractedData || {};
    const scoreData = calculateLeadScore(data);
    const recommendation = recommendUniversities(data);
    const summary = buildSummary(data);
    const topUniversityObjects = await recommendUniversitiesAdvanced(data);

    let lead = await Lead.findOne({ conversationId: conversation._id });

    if (lead) {
      lead.name = data.name || "";
      lead.phone = data.phone || "";
      lead.email = data.email || "";
      lead.location = data.location || "";
      lead.education_level = data.education_level || "";
      lead.field = data.field || "";
      lead.institution = data.institution || "";
      lead.gpa_percentage = data.gpa_percentage || "";
      lead.target_countries = data.target_countries || [];
      lead.course_interest = data.course_interest || "";
      lead.intake_timing = data.intake_timing || "";
      lead.test_status = data.test_status || "";
      lead.test_score = data.test_score || "";
      lead.budget_range = data.budget_range || "";
      lead.scholarship_interest = data.scholarship_interest || "";
      lead.application_timeline = data.application_timeline || "";
      lead.concerns = data.concerns || "";
      lead.interestQuestionCount = data.interestQuestionCount || 0;
      lead.sentiment = data.sentiment || "neutral";
      lead.summary = summary;
      lead.leadScore = scoreData.total;
      lead.leadCategory = scoreData.category;
      lead.recommendedAction = scoreData.recommendedAction;
      lead.recommendedCountry =
        topUniversityObjects[0]?.country ||
        recommendation.recommendedCountry ||
        "";
      lead.topUniversities = topUniversityObjects.map((u) => u.name);
      lead.recommendedUniversitiesDetailed = topUniversityObjects;
      lead.callbackRequested = false;
      lead.callStatus = "completed";
      lead.priorityScore = computePriorityScore(lead);

      await lead.save();
    } else {
      const finalLead = {
        studentId: null,
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
        topUniversities: topUniversityObjects.map((u) => u.name),
        recommendedUniversitiesDetailed: topUniversityObjects,
        callbackRequested: false,
        callStatus: "completed",
      };

      lead = await Lead.create({
        ...finalLead,
        priorityScore: computePriorityScore(finalLead),
      });
    }

    conversation.status = "completed";
    await conversation.save();

    return res.json({
      success: true,
      leadId: String(lead._id),
      leadScore: lead.leadScore,
      leadCategory: lead.leadCategory,
      callStatus: lead.callStatus,
      priorityScore: lead.priorityScore,
      topUniversities: lead.topUniversities || [],
      recommendedCountry: lead.recommendedCountry || "",
    });
  } catch (error) {
    console.error("finalize-lead error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;