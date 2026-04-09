function generateCounsellorReply({
  language = "english",
  missingFields = [],
  knowledgeAnswer = null,
}) {
  const lang = language.toLowerCase();

  const fieldQuestions = {
    name: {
      english: "May I know your full name?",
      hindi: "Kya main aapka full name jaan sakta hoon?",
      marathi: "Mala tumcha full name sangal ka?",
    },
    phone: {
      english: "Could you share your phone number?",
      hindi: "Kya aap apna phone number share kar sakte ho?",
      marathi: "Tumcha phone number share karal ka?",
    },
    email: {
      english: "Please share your email ID.",
      hindi: "Please apni email ID share kijiye.",
      marathi: "Kripaya tumchi email ID share kara.",
    },
    location: {
      english: "Which city are you from?",
      hindi: "Aap kis city se ho?",
      marathi: "Tumhi kontya city madhun aahat?",
    },
    education_level: {
      english: "What is your current education level?",
      hindi: "Aapki current education level kya hai?",
      marathi: "Tumchi current education level kay aahe?",
    },
    field: {
      english: "Which field have you studied in?",
      hindi: "Aapne kis field mein study ki hai?",
      marathi: "Tumhi kontya field madhye study keli aahe?",
    },
    institution: {
      english: "Which college or institution are you from?",
      hindi: "Aap kis college ya institution se ho?",
      marathi: "Tumhi kontya college kiwa institution madhun aahat?",
    },
    gpa_percentage: {
      english: "What is your GPA or percentage?",
      hindi: "Aapka GPA ya percentage kitna hai?",
      marathi: "Tumcha GPA kiwa percentage kiti aahe?",
    },
    target_countries: {
      english: "Which country are you mainly targeting?",
      hindi: "Aap mainly kis country ko target kar rahe ho?",
      marathi: "Tumhi mainly kontya country la target karta?",
    },
    course_interest: {
      english: "Which course are you interested in?",
      hindi: "Aap kis course mein interested ho?",
      marathi: "Tumhala kontya course madhye interest aahe?",
    },
    intake_timing: {
      english: "Which intake are you planning for?",
      hindi: "Aap kis intake ke liye planning kar rahe ho?",
      marathi: "Tumhi kontya intake sathi planning karta aahat?",
    },
    test_status: {
      english: "Have you taken IELTS, PTE, or TOEFL, or are you still preparing?",
      hindi: "Kya aapne IELTS, PTE, ya TOEFL diya hai, ya abhi prepare kar rahe ho?",
      marathi: "Tumhi IELTS, PTE, kiwa TOEFL dila aahe ka, ki ajun preparation karta aahat?",
    },
    test_score: {
      english: "Do you have your test score available?",
      hindi: "Kya aapka test score available hai?",
      marathi: "Tumcha test score available aahe ka?",
    },
    budget_range: {
      english: "What budget range do you have in mind?",
      hindi: "Aapke mind mein kya budget range hai?",
      marathi: "Tumcha budget range kay aahe?",
    },
    scholarship_interest: {
      english: "Are you looking for scholarship options too?",
      hindi: "Kya aap scholarship options bhi dekh rahe ho?",
      marathi: "Tumhi scholarship options pan baght aahat ka?",
    },
    application_timeline: {
      english: "When are you planning to apply?",
      hindi: "Aap kab apply karne ka plan kar rahe ho?",
      marathi: "Tumhi kadhi apply karaycha plan karta aahat?",
    },
  };

  const thanks = {
    english: "Thanks for sharing that.",
    hindi: "Thanks, aapne yeh share kiya.",
    marathi: "Dhanyavaad, tumhi hi mahiti share keli.",
  };

  const finishText = {
    english: "Thank you. I have collected most of the important details. You can now finish the conversation to generate your report.",
    hindi: "Thank you. Maine zyada important details collect kar li hain. Ab aap report generate karne ke liye conversation finish kar sakte ho.",
    marathi: "Dhanyavaad. Mi bahutek mahattvachi mahiti collect keli aahe. Ata tumhi report generate karanyasathi conversation finish karu shakta.",
  };

  if (knowledgeAnswer && knowledgeAnswer.found) {
    if (missingFields.length > 0) {
      const nextField = missingFields[0];
      const nextQuestion =
        fieldQuestions[nextField]?.[lang] || fieldQuestions[nextField]?.english;

      return {
        reply: `${knowledgeAnswer.answer} ${nextQuestion}`,
        askedField: nextField,
      };
    }

    return {
      reply: knowledgeAnswer.answer,
      askedField: "",
    };
  }

  if (missingFields.length > 0) {
    const nextField = missingFields[0];
    const nextQuestion =
      fieldQuestions[nextField]?.[lang] || fieldQuestions[nextField]?.english;

    return {
      reply: `${thanks[lang] || thanks.english} ${nextQuestion}`,
      askedField: nextField,
    };
  }

  return {
    reply: finishText[lang] || finishText.english,
    askedField: "",
  };
}

module.exports = generateCounsellorReply;