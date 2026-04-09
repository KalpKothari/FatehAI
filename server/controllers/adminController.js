const Lead = require("../models/Lead");
const Conversation = require("../models/Conversation");
const Meeting = require("../models/Meeting");

const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ leadScore: -1, createdAt: -1 });
    return res.json(leads);
  } catch (error) {
    console.error("getAllLeads error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const conversation = await Conversation.findById(lead.conversationId);
    const meeting = await Meeting.findOne({ leadId: lead._id }).sort({ createdAt: -1 });

    return res.json({
      lead,
      conversation,
      meeting,
    });
  } catch (error) {
    console.error("getLeadById error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLeads,
  getLeadById,
};