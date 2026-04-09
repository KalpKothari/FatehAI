const Meeting = require("../models/Meeting");
const Lead = require("../models/Lead");
const sendWhatsAppMessage = require("../services/sendWhatsAppMessage");

const createMeeting = async (req, res) => {
  try {
    const { leadId, date, time, mode, meetingLink, notes } = req.body;

    if (!leadId || !date || !time) {
      return res.status(400).json({
        message: "leadId, date and time are required",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const meeting = await Meeting.create({
      leadId,
      adminId: req.user.id,
      date,
      time,
      mode: mode || "online",
      meetingLink: meetingLink || "",
      notes: notes || "",
      status: "scheduled",
    });

    let whatsappStatus = "not_sent";
    let whatsappError = "";
    let whatsappMessageSid = "";

    if (lead.phone) {
      const whatsappResult = await sendWhatsAppMessage({
        studentName: lead.name,
        studentPhone: lead.phone,
        summary: lead.summary,
        recommendation: lead.recommendedAction,
        universities: lead.topUniversities || [],
        date,
        time,
        mode: mode || "online",
        meetingLink: meetingLink || "",
        notes: notes || "",
      });

      if (whatsappResult.success) {
        whatsappStatus = "sent";
        whatsappMessageSid = whatsappResult.sid || "";

        lead.whatsappStatus = "sent";
        lead.whatsappMessageSid = whatsappMessageSid;
        lead.whatsappSentAt = new Date();
      } else {
        whatsappStatus = "failed";
        whatsappError = whatsappResult.error || "Failed to send WhatsApp";

        lead.whatsappStatus = "failed";
      }

      await lead.save();
    }

    return res.status(201).json({
      message: "Meeting scheduled successfully",
      meeting,
      whatsappStatus,
      whatsappMessageSid,
      whatsappError,
    });
  } catch (error) {
    console.error("createMeeting error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createMeeting };