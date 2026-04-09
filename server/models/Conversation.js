const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    callId: {
      type: String,
      default: "",
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    channel: {
      type: String,
      enum: ["chat", "voice"],
      default: "chat",
      index: true,
    },

    liveStatus: {
      type: String,
      enum: ["ongoing", "ended"],
      default: "ended",
      index: true,
    },

    callStartedAt: {
      type: Date,
      default: null,
    },

    callEndedAt: {
      type: Date,
      default: null,
    },

    lastLiveAt: {
      type: Date,
      default: null,
      index: true,
    },

    preferredLanguage: {
      type: String,
      enum: ["english", "hindi", "marathi", "punjabi", "gujarati", ""],
      default: "",
    },

    lastAskedField: {
      type: String,
      default: "",
    },

    askedFields: {
      type: [String],
      default: [],
    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["ai", "student"],
          required: false,
        },
        text: {
          type: String,
          default: "",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    extractedData: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      location: { type: String, default: "" },
      education_level: { type: String, default: "" },
      field: { type: String, default: "" },
      institution: { type: String, default: "" },
      gpa_percentage: { type: String, default: "" },
      target_countries: { type: [String], default: [] },
      course_interest: { type: String, default: "" },
      intake_timing: { type: String, default: "" },
      test_status: { type: String, default: "" },
      test_score: { type: String, default: "" },
      budget_range: { type: String, default: "" },
      scholarship_interest: { type: String, default: "" },
      application_timeline: { type: String, default: "" },
      concerns: { type: String, default: "" },
      interestQuestionCount: { type: Number, default: 0 },
      sentiment: {
        type: String,
        enum: ["interested", "confused", "low_intent", "neutral"],
        default: "neutral",
      },
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);