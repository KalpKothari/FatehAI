function getMissingFields(profile = {}) {
  const requiredFields = [
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
    "budget_range",
    "scholarship_interest",
    "application_timeline",
  ];

  return requiredFields.filter((field) => {
    const value = profile[field];

    if (Array.isArray(value)) return value.length === 0;
    return !value || String(value).trim() === "";
  });
}

module.exports = getMissingFields;