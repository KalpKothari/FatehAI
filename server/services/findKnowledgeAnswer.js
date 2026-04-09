const KnowledgeBase = require("../models/KnowledgeBase");

// simple synonym expansion (can grow later)
const synonymMap = {
  ielts: ["ielts", "english test", "language test"],
  visa: ["visa", "immigration", "student visa"],
  cost: ["cost", "budget", "fees", "expense", "money"],
  scholarship: ["scholarship", "funding", "discount"],
  university: ["university", "college"],
};

function normalize(text = "") {
  return text.toLowerCase().trim();
}

function expandKeywords(message) {
  const words = message.split(" ");
  const expanded = new Set(words);

  for (const key in synonymMap) {
    if (words.some((w) => synonymMap[key].includes(w))) {
      synonymMap[key].forEach((s) => expanded.add(s));
    }
  }

  return Array.from(expanded);
}

async function findKnowledgeAnswer(message = "") {
  try {
    const lowerMessage = normalize(message);
    const expandedWords = expandKeywords(lowerMessage);

    const kbItems = await KnowledgeBase.find();

    let bestMatch = null;
    let bestScore = 0;

    for (const item of kbItems) {
      let score = 0;

      // keyword matching
      for (const keyword of item.keywords || []) {
        const k = normalize(keyword);

        if (expandedWords.some((word) => k.includes(word) || word.includes(k))) {
          score += 2; // stronger weight
        }
      }

      // category match
      if (
        item.category &&
        expandedWords.some((word) =>
          normalize(item.category).includes(word)
        )
      ) {
        score += 1;
      }

      // question similarity (basic)
      if (
        item.question &&
        expandedWords.some((word) =>
          normalize(item.question).includes(word)
        )
      ) {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore >= 2) {
      return {
        found: true,
        category: bestMatch.category,
        question: bestMatch.question,
        answer: bestMatch.answer,
        confidence: bestScore,
      };
    }

    // fallback intelligent response
    return {
      found: false,
      answer:
        "That depends on your profile and course. A counsellor can guide you better. If you want, I can help based on your details.",
    };
  } catch (error) {
    console.error("Knowledge search error:", error);

    return {
      found: false,
      answer:
        "I can give you general guidance, but a counsellor will provide exact details.",
    };
  }
}

module.exports = findKnowledgeAnswer;