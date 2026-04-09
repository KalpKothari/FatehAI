function looksLikeName(text) {
  return /^[A-Za-z][A-Za-z\s]{1,40}$/.test(text.trim());
}

function extractStudentData(message = "", existingData = {}, lastAskedField = "") {
  const text = message.trim();
  const lower = text.toLowerCase();

  const extracted = {};

  // If we specifically asked for name and user typed plain name
  if (lastAskedField === "name" && !existingData.name && looksLikeName(text)) {
    extracted.name = text;
  }

  // Name by pattern
  const nameMatch =
    text.match(/my name is ([a-zA-Z\s]+)/i) ||
    text.match(/i am ([a-zA-Z\s]+)/i) ||
    text.match(/this is ([a-zA-Z\s]+)/i);

  if (nameMatch && !existingData.name) {
    extracted.name = nameMatch[1].trim();
  }

  // Phone
  const phoneMatch = text.match(/\b\d{10}\b/);
  if (phoneMatch && !existingData.phone) {
    extracted.phone = phoneMatch[0];
  }

  // Email
  const emailMatch = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
  );
  if (emailMatch && !existingData.email) {
    extracted.email = emailMatch[0];
  }

  // Location
  const locationMatch =
    text.match(/i am from ([a-zA-Z\s]+)/i) ||
    text.match(/from ([a-zA-Z\s]+)/i) ||
    text.match(/i live in ([a-zA-Z\s]+)/i);

  if (locationMatch && !existingData.location) {
    extracted.location = locationMatch[1].trim();
  }

  // Education
  if (!existingData.education_level) {
    if (lower.includes("12th")) extracted.education_level = "12th";
    else if (lower.includes("btech")) extracted.education_level = "BTech";
    else if (lower.includes("be")) extracted.education_level = "BE";
    else if (lower.includes("bsc")) extracted.education_level = "BSc";
    else if (lower.includes("bcom")) extracted.education_level = "BCom";
    else if (lower.includes("ba")) extracted.education_level = "BA";
    else if (lower.includes("mtech")) extracted.education_level = "MTech";
    else if (lower.includes("msc")) extracted.education_level = "MSc";
    else if (lower.includes("mba")) extracted.education_level = "MBA";
    else if (lower.includes("graduation")) extracted.education_level = "Graduation";
  }

  // Field
  if (!existingData.field) {
    if (lower.includes("computer")) extracted.field = "Computer Science / IT";
    else if (lower.includes("data analytics")) extracted.field = "Data Analytics";
    else if (lower.includes("business")) extracted.field = "Business";
    else if (lower.includes("engineering")) extracted.field = "Engineering";
    else if (lower.includes("commerce")) extracted.field = "Commerce";
    else if (lower.includes("arts")) extracted.field = "Arts";
    else if (lower.includes("nursing")) extracted.field = "Nursing";
  }

  // Institution
  const institutionMatch =
    text.match(/from ([a-zA-Z0-9\s&.,-]+ college)/i) ||
    text.match(/from ([a-zA-Z0-9\s&.,-]+ university)/i) ||
    text.match(/from ([a-zA-Z0-9\s&.,-]+ institute)/i);

  if (institutionMatch && !existingData.institution) {
    extracted.institution = institutionMatch[1].trim();
  }

  // GPA / Percentage
  const percentageMatch = text.match(/\b(\d{2,3})\s?%/);
  const cgpaMatch = text.match(/\b(\d(?:\.\d)?)\s?(cgpa|gpa)\b/i);

  if (!existingData.gpa_percentage) {
    if (percentageMatch) extracted.gpa_percentage = `${percentageMatch[1]}%`;
    else if (cgpaMatch) extracted.gpa_percentage = `${cgpaMatch[1]} ${cgpaMatch[2].toUpperCase()}`;
  }

  // Target countries
  if (!existingData.target_countries || existingData.target_countries.length === 0) {
    const countries = [];
    if (lower.includes("uk") || lower.includes("united kingdom")) countries.push("UK");
    if (lower.includes("ireland")) countries.push("Ireland");
    if (lower.includes("canada")) countries.push("Canada");
    if (lower.includes("australia")) countries.push("Australia");

    if (countries.length > 0) extracted.target_countries = countries;
  }

  // Course interest
  if (!existingData.course_interest) {
    if (lower.includes("data analytics")) extracted.course_interest = "Data Analytics";
    else if (lower.includes("data science")) extracted.course_interest = "Data Science";
    else if (lower.includes("mba")) extracted.course_interest = "MBA";
    else if (lower.includes("computer science")) extracted.course_interest = "Computer Science";
    else if (lower.includes("business analytics")) extracted.course_interest = "Business Analytics";
    else if (lower.includes("nursing")) extracted.course_interest = "Nursing";
    else if (lower.includes("cyber security")) extracted.course_interest = "Cyber Security";
  }

  // Intake
  if (!existingData.intake_timing) {
    const intakeMatch = text.match(
      /\b(january|jan|february|march|april|may|june|july|august|september|sept|october|november|december)\s+\d{4}\b/i
    );
    if (intakeMatch) extracted.intake_timing = intakeMatch[0];
  }

  // Test status
  if (!existingData.test_status) {
    if (lower.includes("preparing for ielts")) extracted.test_status = "Preparing IELTS";
    else if (lower.includes("preparing for pte")) extracted.test_status = "Preparing PTE";
    else if (lower.includes("not started")) extracted.test_status = "Not started";
    else if (lower.includes("completed ielts")) extracted.test_status = "Completed IELTS";
    else if (lower.includes("completed pte")) extracted.test_status = "Completed PTE";
    else if (lower.includes("ielts")) extracted.test_status = "IELTS mentioned";
    else if (lower.includes("pte")) extracted.test_status = "PTE mentioned";
    else if (lower.includes("toefl")) extracted.test_status = "TOEFL mentioned";
  }

  // Test score
  if (!existingData.test_score) {
    const scoreMatch = text.match(/\b(score|band)\s*(is)?\s*(\d(?:\.\d)?)\b/i);
    if (scoreMatch) extracted.test_score = scoreMatch[3];
  }

  // Budget
  if (!existingData.budget_range) {
    const budgetMatchLakhs = text.match(/(\d{1,2})\s*(to|-)?\s*(\d{1,2})?\s*lakh/i);
    if (budgetMatchLakhs) {
      extracted.budget_range = budgetMatchLakhs[3]
        ? `${budgetMatchLakhs[1]}-${budgetMatchLakhs[3]} Lakhs`
        : `${budgetMatchLakhs[1]} Lakhs`;
    }
  }

  // Scholarship
  if (!existingData.scholarship_interest && lower.includes("scholarship")) {
    extracted.scholarship_interest = "Yes";
  }

  // Timeline
  if (!existingData.application_timeline) {
    if (lower.includes("within 3 months")) extracted.application_timeline = "Within 3 months";
    else if (lower.includes("within 6 months")) extracted.application_timeline = "Within 6 months";
    else if (lower.includes("next year")) extracted.application_timeline = "Next year";
    else if (lower.includes("soon")) extracted.application_timeline = "Soon";
  }

  // Concerns
  if (
    !existingData.concerns &&
    (
      lower.includes("worried") ||
      lower.includes("confused") ||
      lower.includes("concern") ||
      lower.includes("visa") ||
      lower.includes("cost") ||
      lower.includes("scholarship")
    )
  ) {
    extracted.concerns = text;
  }

  return extracted;
}

module.exports = extractStudentData;