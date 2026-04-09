function cleanText(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function toTitleCase(text = "") {
  return String(text)
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function levenshtein(a = "", b = "") {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

function bestFuzzyMatch(input = "", options = [], maxDistance = 3) {
  const normalizedInput = cleanText(input);
  if (!normalizedInput) return input;

  let best = input;
  let bestDistance = Infinity;

  for (const option of options) {
    const dist = levenshtein(normalizedInput, cleanText(option));
    if (dist < bestDistance) {
      bestDistance = dist;
      best = option;
    }
  }

  return bestDistance <= maxDistance ? best : input;
}

const courseMap = {
  "Computer Science": [
    "computer science",
    "cs",
    "comp sci",
    "kampyutar science",
    "kampyutar sayens",
    "computer",
    "कॉम्प्युटर सायन्स",
    "कंप्यूटर साइंस",
  ],
  "Data Science": [
    "data science",
    "data analytics",
    "data analyst",
    "डेटा साइंस",
    "डेटा सायन्स",
  ],
  Business: [
    "business",
    "business management",
    "management",
    "mba",
    "बिजनेस",
    "मैनेजमेंट",
  ],
  Engineering: [
    "engineering",
    "engineer",
    "btech",
    "mtech",
    "इंजीनियरिंग",
    "इंजिनिअरिंग",
  ],
  Marketing: ["marketing", "digital marketing", "मार्केटिंग"],
  Finance: ["finance", "banking", "accounting", "फायनान्स", "फाइनेंस"],
};

const countryMap = {
  UK: ["uk", "united kingdom", "england", "britain", "युके", "इंग्लैंड"],
  Ireland: ["ireland", "dublin", "आयरलैंड", "आयर्लंड"],
};

const educationMap = {
  "12th": ["12th", "hsc", "intermediate", "junior college", "बारावी", "12वी"],
  Graduation: ["graduation", "graduate", "bachelor", "degree", "ug", "ग्रेजुएशन"],
  "Post Graduation": ["post graduation", "postgraduate", "masters", "pg", "मास्टर्स"],
};

const cityMap = {
  Mumbai: ["mumbai", "bombay", "मुंबई"],
  Pune: ["pune", "पुणे"],
  Delhi: ["delhi", "new delhi", "दिल्ली"],
  Hyderabad: ["hyderabad", "हैदराबाद"],
  Bangalore: ["bangalore", "bengaluru", "बेंगलुरु"],
  Nagpur: ["nagpur", "नागपुर"],
  Nashik: ["nashik", "नासिक"],
};

function normalizeByMap(text = "", map = {}) {
  const t = cleanText(text);
  if (!t) return "";

  for (const standard in map) {
    for (const variant of map[standard]) {
      const v = cleanText(variant);
      if (t.includes(v) || v.includes(t)) {
        return standard;
      }
    }
  }

  return text;
}

function normalizeCourse(text = "") {
  let result = normalizeByMap(text, courseMap);
  result = bestFuzzyMatch(result, Object.keys(courseMap), 4);
  return result || toTitleCase(text);
}

function normalizeCountries(value) {
  const arr = Array.isArray(value) ? value : value ? [value] : [];
  const normalized = arr
    .map((item) => {
      const result = normalizeByMap(item, countryMap);
      return result || toTitleCase(item);
    })
    .filter(Boolean);

  return [...new Set(normalized)];
}

function normalizeEducation(text = "") {
  const result = normalizeByMap(text, educationMap);
  return result || toTitleCase(text);
}

function normalizeLocation(text = "") {
  let result = normalizeByMap(text, cityMap);
  result = bestFuzzyMatch(result, Object.keys(cityMap), 3);
  return result || toTitleCase(text);
}

function normalizeBudget(text = "") {
  const raw = String(text || "").trim();
  if (!raw) return "";

  const lower = cleanText(raw);
  const match = lower.match(/(\d{1,3})/);
  if (!match) return raw;

  const value = parseInt(match[1], 10);
  if (Number.isNaN(value)) return raw;

  return `${value} lakh`;
}

function normalizeTestStatus(text = "") {
  const t = cleanText(text);

  if (!t) return "";
  if (t.includes("not started")) return "Not Started";
  if (t.includes("preparing")) return "Preparing";
  if (t.includes("booked")) return "Booked";
  if (t.includes("completed") || t.includes("done")) return "Completed";
  if (t.includes("score")) return "Score Available";

  return toTitleCase(text);
}

function detectIntentSignals(raw = {}) {
  const blob = cleanText(
    [
      raw.concerns,
      raw.course_interest,
      raw.budget_range,
      raw.application_timeline,
      raw.intake_timing,
    ]
      .filter(Boolean)
      .join(" ")
  );

  let interestQuestionCount = 0;
  const positiveTopics = [
    "budget",
    "cost",
    "fee",
    "fees",
    "visa",
    "ielts",
    "pte",
    "scholarship",
    "loan",
    "university",
    "college",
    "intake",
    "timeline",
    "application",
    "admission",
  ];

  positiveTopics.forEach((topic) => {
    if (blob.includes(topic)) interestQuestionCount += 1;
  });

  let sentiment = "neutral";

  const interestedWords = [
    "interested",
    "want",
    "plan",
    "curious",
    "scholarship",
    "visa",
    "budget",
    "admission",
    "process",
    "ielts",
  ];
  const confusedWords = ["not sure", "confused", "don't know", "dont know", "unclear"];
  const lowIntentWords = ["just checking", "later", "not now", "no idea", "not interested"];

  if (interestedWords.some((w) => blob.includes(w))) sentiment = "interested";
  if (confusedWords.some((w) => blob.includes(w))) sentiment = "confused";
  if (lowIntentWords.some((w) => blob.includes(w))) sentiment = "low_intent";

  return { interestQuestionCount, sentiment };
}

function normalizeLeadData(raw = {}) {
  const normalized = {
    callId: raw.callId || raw.callid || `partial_${Date.now()}`,
    name: toTitleCase(raw.name || ""),
    phone: String(raw.phone || "").replace(/[^\d+]/g, ""),
    email: String(raw.email || "").trim().toLowerCase(),
    location: normalizeLocation(raw.location || ""),
    education_level: normalizeEducation(raw.education_level || raw.educational_level || ""),
    field: toTitleCase(raw.field || ""),
    institution: toTitleCase(raw.institution || ""),
    gpa_percentage: String(raw.gpa_percentage || "").trim(),
    target_countries: normalizeCountries(raw.target_countries),
    course_interest: normalizeCourse(raw.course_interest || ""),
    intake_timing: toTitleCase(raw.intake_timing || ""),
    test_status: normalizeTestStatus(raw.test_status || ""),
    test_score: String(raw.test_score || "").trim(),
    budget_range: normalizeBudget(raw.budget_range || ""),
    scholarship_interest: toTitleCase(raw.scholarship_interest || ""),
    application_timeline: toTitleCase(raw.application_timeline || ""),
    concerns: String(raw.concerns || "").trim(),
  };

  const signals = detectIntentSignals(normalized);

  return {
    ...normalized,
    ...signals,
  };
}

module.exports = normalizeLeadData;