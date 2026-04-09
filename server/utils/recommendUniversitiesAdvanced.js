const University = require("../models/University");

function normalizeText(value = "") {
  return String(value || "").trim().toLowerCase();
}

function parsePercent(text = "") {
  const n = parseFloat(String(text).match(/(\d+(\.\d+)?)/)?.[1] || "");
  return Number.isNaN(n) ? 0 : n;
}

function parseBudgetLakh(text = "") {
  const n = parseFloat(String(text).match(/(\d+(\.\d+)?)/)?.[1] || "");
  return Number.isNaN(n) ? 0 : n;
}

function parseIelts(testStatus = "", testScore = "") {
  const score = parseFloat(
    String(testScore).match(/(\d+(\.\d+)?)/)?.[1] || ""
  );

  return {
    hasScore: !Number.isNaN(score),
    score: Number.isNaN(score) ? 0 : score,
    status: normalizeText(testStatus),
  };
}

function normalizeLevel(educationLevel = "") {
  const t = normalizeText(educationLevel);

  if (
    t.includes("12") ||
    t.includes("hsc") ||
    t.includes("school") ||
    t.includes("junior college") ||
    t.includes("intermediate")
  ) {
    return "UG";
  }

  if (
    t.includes("graduation") ||
    t.includes("graduate") ||
    t.includes("bachelor") ||
    t.includes("degree") ||
    t.includes("ug") ||
    t.includes("bsc") ||
    t.includes("bcom") ||
    t.includes("bba") ||
    t.includes("bca") ||
    t.includes("be") ||
    t.includes("btech")
  ) {
    return "PG";
  }

  return "UG";
}

function tokenize(text = "") {
  return normalizeText(text)
    .split(/[\s,/&()-]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function courseSimilarity(leadCourse = "", uniTags = []) {
  const lead = normalizeText(leadCourse);
  if (!lead) return 0;

  let best = 0;
  const leadWords = tokenize(lead);

  for (const tag of uniTags || []) {
    const uni = normalizeText(tag);
    if (!uni) continue;

    if (lead === uni) {
      best = Math.max(best, 100);
      continue;
    }

    if (lead.includes(uni) || uni.includes(lead)) {
      best = Math.max(best, 85);
      continue;
    }

    const uniWords = tokenize(uni);
    const common = leadWords.filter((w) => uniWords.includes(w)).length;

    if (common >= 2) best = Math.max(best, 70);
    else if (common === 1) best = Math.max(best, 45);
  }

  return best;
}

function passesHardFilters(lead, uni) {
  const desiredLevel = normalizeLevel(lead.education_level);
  const preferredCountries = Array.isArray(lead.target_countries)
    ? lead.target_countries
    : [];
  const budget = parseBudgetLakh(lead.budget_range);
  const courseScore = courseSimilarity(lead.course_interest, uni.courseTags || []);

  // country filter if user selected countries
  if (preferredCountries.length && !preferredCountries.includes(uni.country)) {
    return false;
  }

  // level filter
  if (!(uni.levels || []).includes(desiredLevel)) {
    return false;
  }

  // course filter
  if (lead.course_interest && courseScore < 45) {
    return false;
  }

  // loose budget filter
  if (budget > 0 && uni.annualTuitionLakhMin > budget + 8) {
    return false;
  }

  return true;
}

function scoreUniversity(lead, uni) {
  let score = 0;

  const desiredLevel = normalizeLevel(lead.education_level);
  const percentage = parsePercent(lead.gpa_percentage);
  const budget = parseBudgetLakh(lead.budget_range);
  const ielts = parseIelts(lead.test_status, lead.test_score);
  const preferredCountries = Array.isArray(lead.target_countries)
    ? lead.target_countries
    : [];

  const courseScore = courseSimilarity(lead.course_interest, uni.courseTags || []);
  score += courseScore; // max 100

  // Country preference
  if (preferredCountries.includes(uni.country)) {
    score += 40;
  }

  // Level fit
  if ((uni.levels || []).includes(desiredLevel)) {
    score += 20;
  } else {
    score -= 30;
  }

  // Academic fit
  if (desiredLevel === "UG") {
    const minUG = uni.minAcademicPercentageUG || 0;
    if (percentage >= minUG) score += 25;
    else if (percentage > 0) score -= Math.min(25, minUG - percentage);
  }

  if (desiredLevel === "PG") {
    const minPG = uni.minAcademicPercentagePG || 0;
    if (percentage >= minPG) score += 25;
    else if (percentage > 0) score -= Math.min(25, minPG - percentage);
  }

  // IELTS fit
  const requiredIelts =
    desiredLevel === "UG" ? uni.minIeltsUG || 0 : uni.minIeltsPG || 0;

  if (ielts.hasScore) {
    if (ielts.score >= requiredIelts) {
      score += 20;
      if (ielts.score >= requiredIelts + 0.5) score += 5;
    } else {
      score -= 25;
    }
  } else if (
    ielts.status.includes("preparing") ||
    ielts.status.includes("booked") ||
    ielts.status.includes("not started") ||
    ielts.status.includes("planning")
  ) {
    score += 5;
  }

  // Budget fit
  if (budget > 0) {
    const minFee = uni.annualTuitionLakhMin || 0;
    const maxFee = uni.annualTuitionLakhMax || 0;

    if (budget >= minFee && budget <= maxFee) {
      score += 25;
    } else if (budget >= minFee && budget > maxFee) {
      score += 18;
    } else if (budget + 3 >= minFee) {
      score += 8;
    } else {
      score -= 20;
    }
  }

  // Scholarship fit
  if (normalizeText(lead.scholarship_interest).includes("yes")) {
    if (uni.scholarshipsAvailable) score += 12;
    else score -= 5;
  }

  // Intake / timeline small boosts
  if (lead.intake_timing) score += 3;
  if (lead.application_timeline) score += 3;

  return score;
}

async function recommendUniversitiesAdvanced(lead) {
  const preferredCountries =
    Array.isArray(lead.target_countries) && lead.target_countries.length
      ? lead.target_countries
      : ["UK", "Ireland", "Dubai"];

  let universities = await University.find({
    country: { $in: preferredCountries },
  }).lean();

  // Stage 1: strict filter
  let filtered = universities.filter((uni) => passesHardFilters(lead, uni));

  // Stage 2: relax course filter if too few
  if (filtered.length < 3) {
    filtered = universities.filter((uni) => {
      const desiredLevel = normalizeLevel(lead.education_level);
      const preferredCountries = Array.isArray(lead.target_countries)
        ? lead.target_countries
        : [];
      const budget = parseBudgetLakh(lead.budget_range);

      if (preferredCountries.length && !preferredCountries.includes(uni.country)) {
        return false;
      }

      if (!(uni.levels || []).includes(desiredLevel)) {
        return false;
      }

      if (budget > 0 && uni.annualTuitionLakhMin > budget + 10) {
        return false;
      }

      return true;
    });
  }

  // Stage 3: full fallback
  if (filtered.length < 3) {
    filtered = universities;
  }

  const ranked = filtered
    .map((uni) => ({
      ...uni,
      matchScore: scoreUniversity(lead, uni),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  // ensure unique names
  const unique = [];
  const seen = new Set();

  for (const uni of ranked) {
    if (!uni?.name) continue;
    if (seen.has(uni.name)) continue;
    seen.add(uni.name);
    unique.push(uni);
    if (unique.length === 3) break;
  }

  // final fallback if still less than 3
  if (unique.length < 3) {
    const fallback = await University.find({
      country: { $in: preferredCountries },
    })
      .limit(10)
      .lean();

    for (const uni of fallback) {
      if (!uni?.name) continue;
      if (seen.has(uni.name)) continue;
      seen.add(uni.name);
      unique.push({
        ...uni,
        matchScore: scoreUniversity(lead, uni),
      });
      if (unique.length === 3) break;
    }
  }

  const result = unique.map((u) => ({
    name: u.name || "",
    country: u.country || "",
    city: u.city || "",
    matchScore: u.matchScore || 0,
    officialUrl: u.officialUrl || "",
  }));

  console.log("Lead profile for university recommendation:", {
    course_interest: lead.course_interest,
    education_level: lead.education_level,
    gpa_percentage: lead.gpa_percentage,
    budget_range: lead.budget_range,
    test_status: lead.test_status,
    test_score: lead.test_score,
    target_countries: lead.target_countries,
    scholarship_interest: lead.scholarship_interest,
  });

  console.log("Filtered university count:", filtered.length);
  console.log("Top university recommendation result:", result);

  return result;
}

module.exports = recommendUniversitiesAdvanced;