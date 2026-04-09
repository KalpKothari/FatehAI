const ai = require("../lib/geminiClient");
const withGeminiRetry = require("../utils/geminiRetry");

async function callReplyModel(model, prompt) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingLevel: "low",
      },
    },
  });

  return (response.text || "").trim();
}

async function generateCounsellorReplyLLM({
  preferredLanguage = "english",
  transcript = [],
  extractedData = {},
  missingFields = [],
  knowledgeAnswer = null,
}) {
  const recentTranscript = transcript
    .slice(-12)
    .map((m) => `${m.sender === "ai" ? "Counsellor" : "Student"}: ${m.text}`)
    .join("\n");

  const prompt = `
You are a professional AI study abroad counsellor from Fateh Education.

Language rules:
- Continue ONLY in ${preferredLanguage}.
- If the language is Hindi or Marathi, natural Hindi/Marathi in English script is acceptable.
- Sound like a real counsellor, not a form.
- Keep responses concise, warm, natural, and human.

Behavior rules:
- Never repeat a question already answered.
- Ask only ONE main next question.
- If the student asks a doubt, answer it briefly first.
- Then continue the counselling flow naturally.
- Use the collected profile and missing fields to ask the next most useful question.
- If enough details are collected, tell the student they can finish the conversation.

Collected profile:
${JSON.stringify(extractedData, null, 2)}

Missing fields:
${JSON.stringify(missingFields)}

Knowledge base answer to use if relevant:
${knowledgeAnswer?.found ? knowledgeAnswer.answer : "None"}

Recent conversation:
${recentTranscript}
`;

  const primaryModel =
    process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL || "gemini-3-flash-preview";

  try {
    return await withGeminiRetry(
      () => callReplyModel(primaryModel, prompt),
      { retries: 2, baseDelayMs: 1200 }
    );
  } catch (primaryError) {
    return await withGeminiRetry(
      () => callReplyModel(fallbackModel, prompt),
      { retries: 2, baseDelayMs: 1500 }
    );
  }
}

module.exports = generateCounsellorReplyLLM;