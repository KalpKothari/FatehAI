const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

router.get("/ongoing", async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const conversations = await Conversation.find({
      channel: "voice",
      liveStatus: "ongoing",
      lastLiveAt: { $gte: fiveMinutesAgo },
    })
      .sort({ updatedAt: -1 })
      .lean();

    const ongoingCalls = conversations.map((conv) => ({
      _id: conv._id,
      callId: conv.callId || String(conv._id),
      studentName: conv.extractedData?.name || "Unknown Student",
      phone: conv.extractedData?.phone || "",
      status: conv.status || "active",
      liveStatus: conv.liveStatus || "ongoing",
      updatedAt: conv.updatedAt,
      messages: conv.messages || [],
      latestMessage:
        conv.messages && conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1]
          : null,
    }));

    return res.json({
      success: true,
      ongoingCalls,
    });
  } catch (error) {
    console.error("liveAdminRoutes error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;