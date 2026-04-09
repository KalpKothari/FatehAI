const ai = require("../lib/geminiClient");
const withGeminiRetry = require("../utils/geminiRetry");

const extractionSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    location: { type: "string" },

    education_level: { type: "string" },
    field: { type: "string" },
    institution: { type: "string" },
    gpa_percentage: { type: "string" },

    target_countries: {
      type: "array",
      items: { type: "string" },
    },
    course_interest: { type: "string" },
    intake_timing: { type: "string" },

    test_status: { type: "string" },
    test_score: { type: "string" },

    budget_range: { type: "string" },
    scholarship_interest: { type: "string" },

    application_timeline: { type: "string" },
    concerns: { type: "string" },
  },
  required: [
    "name",
    "phone",
    "email",
    "location",
    "education_level",
    "field",
    "institution",
    "gpa_percentage",
    "target_countries",
    "course_interest",
    "intake_timing",
    "test_status",
    "test_score",
    "budget_range",
    "scholarship_interest",
    "application_timeline",
    "concerns",
  ],
};

async function callExtractionModel(model, prompt) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: extractionSchema,
      thinkingConfig: {
        thinkingLevel: "minimal",
      },
    },
  });

  return response.text || "{}";
}

async function extractStudentDataLLM({
  latestMessage,
  existingData = {},
  lastAskedField = "",
  preferredLanguage = "english",
}) {
  const prompt = `
You extract structured counselling data from a student's message.

Rules:
- Return only valid JSON.
- Do not guess.
- If a field is not clearly present, return empty string "".
- For target_countries, return [] if not clearly present.
- Use lastAskedField to interpret short replies like:
  - "Mumbai" for location
  - "BTech" for education
  - "20 lakhs" for budget
  - "September 2026" for intake
  - "Yes" / "No" for scholarship_interest
- Student may reply in English, Hindi, Marathi, or mixed Hinglish/Marathi in English script.

Preferred language: ${preferredLanguage}
Last asked field: ${lastAskedField}

Existing profile:
${JSON.stringify(existingData, null, 2)}

Latest student message:
${latestMessage}
`;

  const primaryModel =
    process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL || "gemini-3-flash-preview";

  try {
    const raw = await withGeminiRetry(
      () => callExtractionModel(primaryModel, prompt),
      { retries: 2, baseDelayMs: 1200 }
    );
    return JSON.parse(raw);
  } catch (primaryError) {
    const raw = await withGeminiRetry(
      () => callExtractionModel(fallbackModel, prompt),
      { retries: 2, baseDelayMs: 1500 }
    );
    return JSON.parse(raw);
  }
}

module.exports = extractStudentDataLLM;