const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: String,
    country: {
      type: String,
      enum: ["UK", "Ireland", "Dubai"],
      index: true,
    },
    city: String,

    levels: [String],
    courseTags: [String],

    minAcademicPercentageUG: Number,
    minAcademicPercentagePG: Number,

    minIeltsUG: Number,
    minIeltsPG: Number,

    annualTuitionLakhMin: Number,
    annualTuitionLakhMax: Number,

    scholarshipsAvailable: Boolean,

    officialUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("University", universitySchema);