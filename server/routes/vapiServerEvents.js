const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

function extractCallId(message = {}) {
  return (
    message?.call?.id ||
    message?.callId ||
    message?.call?.orgCallId ||
    ""
  );
}

function extractPhone(message = {}) {
  return (
    message?.customer?.number ||
    message?.phoneNumber ||
    message?.call?.customer?.number ||
    ""
  );
}

function extractLatestText(message = {}) {
  if (message?.transcript) return message.transcript;
  if (message?.text) return message.text;
  if (message?.artifact?.transcript) return message.artifact.transcript;

  const msgs = message?.artifact?.messages || [];
  const last = msgs[msgs.length - 1];

  return last?.message || last?.text || "";
}

function extractRole(message = {}) {
  if (message?.role) return message.role;

  const msgs = message?.artifact?.messages || [];
  const last = msgs[msgs.length - 1];

  return last?.role || "assistant";
}

function emitLiveCall(io, conversation) {
  io.to("admin-live-calls").emit("live-call-update", {
    _id: conversation._id,
    callId: conversation.callId || "",
    channel: "voice",
    liveStatus: conversation.liveStatus,
    status: conversation.status,
    studentName: conversation.extractedData?.name || "Unknown Student",
    phone: conversation.extractedData?.phone || "",
    messages: conversation.messages || [],
    latestMessage:
      conversation.messages?.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : null,
    updatedAt: conversation.updatedAt,
  });
}

router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");
    const body = req.body || {};
    const message = body.message;

    console.log("VAPI EVENT:", JSON.stringify(body, null, 2));

    if (!message?.type) {
      return res.status(200).json({
        success: true,
        skipped: true,
        reason: "Missing message.type",
      });
    }

    const eventType = message.type;
    const callId = extractCallId(message);

    if (!callId) {
      return res.status(200).json({
        success: true,
        skipped: true,
        reason: "Missing callId",
      });
    }

    let conversation = await Conversation.findOne({ callId });

    if (!conversation) {
      conversation = await Conversation.create({
        callId,
        studentId: null,
        channel: "voice",
        liveStatus: "ongoing",
        callStartedAt: new Date(),
        lastLiveAt: new Date(),
        preferredLanguage: "",
        lastAskedField: "",
        askedFields: [],
        messages: [],
        extractedData: {
          name: "",
          phone: extractPhone(message),
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
    }

    conversation.channel = "voice";
    conversation.lastLiveAt = new Date();

    if (!conversation.callStartedAt) {
      conversation.callStartedAt = new Date();
    }

    if (
      eventType === "speech-update" ||
      eventType === "transcript" ||
      eventType === "transcript-update"
    ) {
      const text = extractLatestText(message);
      const role = extractRole(message);

      if (text && String(text).trim() !== "") {
        const sender =
          role === "user" || role === "customer" || role === "student"
            ? "student"
            : "ai";

        conversation.liveStatus = "ongoing";
        conversation.status = "active";

        conversation.messages.push({
          sender,
          text,
          timestamp: new Date(),
        });

        await conversation.save();
        emitLiveCall(io, conversation);
      }
    }

    if (
      eventType === "call-start" ||
      eventType === "conversation-start" ||
      eventType === "status-update"
    ) {
      const currentStatus =
        message?.status || message?.call?.status || "";

      if (
        currentStatus === "in-progress" ||
        currentStatus === "active" ||
        currentStatus === "ringing" ||
        currentStatus === "started"
      ) {
        conversation.liveStatus = "ongoing";
        conversation.status = "active";
        conversation.lastLiveAt = new Date();

        await conversation.save();
        emitLiveCall(io, conversation);
      }
    }

    if (
      eventType === "hang" ||
      eventType === "call-end" ||
      eventType === "conversation-end" ||
      eventType === "end-of-call-report"
    ) {
      conversation.liveStatus = "ended";
      conversation.status = "completed";
      conversation.callEndedAt = new Date();
      conversation.lastLiveAt = new Date();

      await conversation.save();
      emitLiveCall(io, conversation);
    }

    if (eventType === "status-update") {
      const currentStatus =
        message?.status || message?.call?.status || message?.endedReason || "";

      if (
        currentStatus === "ended" ||
        currentStatus === "completed" ||
        currentStatus === "hangup" ||
        currentStatus === "customer-ended-call" ||
        currentStatus === "assistant-ended-call"
      ) {
        conversation.liveStatus = "ended";
        conversation.status = "completed";
        conversation.callEndedAt = new Date();
        conversation.lastLiveAt = new Date();

        await conversation.save();
        emitLiveCall(io, conversation);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("vapiServerEvents error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;