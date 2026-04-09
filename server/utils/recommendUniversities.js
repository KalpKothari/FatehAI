function recommendUniversities(data) {
  const countries = (data.target_countries || []).map((c) => c.toLowerCase());
  const course = (data.course_interest || "").toLowerCase();

  if (countries.includes("ireland") && course.includes("data")) {
    return {
      recommendedCountry: "Ireland",
      topUniversities: [
        "University College Dublin",
        "Dublin City University",
        "National College of Ireland",
      ],
    };
  }

  if (countries.includes("uk") && course.includes("business")) {
    return {
      recommendedCountry: "UK",
      topUniversities: [
        "University of Birmingham",
        "University of Leeds",
        "Coventry University",
      ],
    };
  }

  if (countries.includes("uk")) {
    return {
      recommendedCountry: "UK",
      topUniversities: [
        "University of Portsmouth",
        "Coventry University",
        "University of Leicester",
      ],
    };
  }

  if (countries.includes("ireland")) {
    return {
      recommendedCountry: "Ireland",
      topUniversities: [
        "University College Dublin",
        "Dublin City University",
        "Griffith College",
      ],
    };
  }

  return {
    recommendedCountry: data.target_countries?.[0] || "UK",
    topUniversities: [
      "University 1",
      "University 2",
      "University 3",
    ],
  };
}

module.exports = recommendUniversities;