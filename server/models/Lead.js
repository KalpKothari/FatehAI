const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    education_level: {
      type: String,
      default: "",
    },

    field: {
      type: String,
      default: "",
    },

    institution: {
      type: String,
      default: "",
    },

    gpa_percentage: {
      type: String,
      default: "",
    },

    target_countries: {
      type: [String],
      default: [],
    },

    course_interest: {
      type: String,
      default: "",
    },

    intake_timing: {
      type: String,
      default: "",
    },

    test_status: {
      type: String,
      default: "",
    },

    test_score: {
      type: String,
      default: "",
    },

    budget_range: {
      type: String,
      default: "",
    },

    scholarship_interest: {
      type: String,
      default: "",
    },

    application_timeline: {
      type: String,
      default: "",
    },

    concerns: {
      type: String,
      default: "",
    },

    interestQuestionCount: {
      type: Number,
      default: 0,
    },

    sentiment: {
      type: String,
      enum: ["interested", "confused", "low_intent", "neutral"],
      default: "neutral",
    },

    summary: {
      type: String,
      default: "",
    },

    leadScore: {
      type: Number,
      default: 0,
    },

    leadCategory: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Cold",
      index: true,
    },

    recommendedAction: {
      type: String,
      default: "",
    },

    recommendedCountry: {
      type: String,
      default: "",
    },

    topUniversities: {
      type: [String],
      default: [],
    },

    recommendedUniversitiesDetailed: {
      type: [
        {
          name: {
            type: String,
            default: "",
          },
          country: {
            type: String,
            default: "",
          },
          city: {
            type: String,
            default: "",
          },
          matchScore: {
            type: Number,
            default: 0,
          },
          officialUrl: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    callbackRequested: {
      type: Boolean,
      default: false,
    },

    callStatus: {
      type: String,
      enum: ["partial", "completed"],
      default: "partial",
      index: true,
    },

    whatsappStatus: {
      type: String,
      enum: ["not_sent", "sent", "failed"],
      default: "not_sent",
      index: true,
    },

    whatsappMessageSid: {
      type: String,
      default: "",
    },

    whatsappSentAt: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      default: "voice_ai",
    },

    priorityScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);