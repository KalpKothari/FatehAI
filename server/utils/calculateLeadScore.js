function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function parseBudgetValue(budgetRange) {
  const text = String(budgetRange || "").toLowerCase();
  const match = text.match(/(\d{1,3})/);
  if (!match) return NaN;
  return parseInt(match[1], 10);
}

function calculateLeadScore(data = {}) {
  let interest = 0;
  let budget = 0;
  let timeline = 0;

  if (hasValue(data.target_countries)) interest += 15;
  if (hasValue(data.course_interest)) interest += 15;
  if (hasValue(data.field) || hasValue(data.education_level)) interest += 10;

  if ((data.interestQuestionCount || 0) >= 1) interest += 5;
  if ((data.interestQuestionCount || 0) >= 3) interest += 5;
  if (data.sentiment === "interested") interest += 5;
  if (data.sentiment === "low_intent") interest -= 5;

  if (interest > 40) interest = 40;
  if (interest < 0) interest = 0;

  const budgetValue = parseBudgetValue(data.budget_range);

  if (!isNaN(budgetValue)) {
    if (budgetValue >= 15) budget = 30;
    else if (budgetValue >= 10) budget = 20;
    else if (budgetValue >= 6) budget = 10;
  }

  if (hasValue(data.scholarship_interest) && budget < 30) budget += 5;
  if (budget > 30) budget = 30;

  if (hasValue(data.intake_timing)) timeline += 10;
  if (hasValue(data.application_timeline)) timeline += 10;
  if (hasValue(data.test_status)) timeline += 10;
  if (timeline > 30) timeline = 30;

  let total = interest + budget + timeline;

  let completedCoreFields = 0;
  if (hasValue(data.name)) completedCoreFields++;
  if (hasValue(data.phone)) completedCoreFields++;
  if (hasValue(data.course_interest)) completedCoreFields++;
  if (hasValue(data.target_countries)) completedCoreFields++;
  if (hasValue(data.budget_range)) completedCoreFields++;
  if (hasValue(data.intake_timing) || hasValue(data.application_timeline)) completedCoreFields++;
  if (hasValue(data.test_status)) completedCoreFields++;

  if (completedCoreFields <= 2) {
    total = Math.min(total, 25);
  } else if (completedCoreFields <= 4) {
    total = Math.min(total, 39);
  }

  let category = "Cold";
  if (total >= 70) category = "Hot";
  else if (total >= 40) category = "Warm";

  let recommendedAction = "Collect more details and nurture";
  if (category === "Hot") recommendedAction = "Immediate counsellor callback";
  else if (category === "Warm") recommendedAction = "Follow up within 24 hours";

  return {
    interest,
    budget,
    timeline,
    total,
    category,
    recommendedAction,
  };
}

module.exports = calculateLeadScore;