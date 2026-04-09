const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function formatWhatsAppNumber(phone) {
  if (!phone) return "";

  let clean = String(phone).replace(/[^\d]/g, "");

  if (clean.length === 10) {
    clean = `+91${clean}`;
  } else if (clean.startsWith("91") && clean.length === 12) {
    clean = `+${clean}`;
  } else if (!clean.startsWith("+")) {
    clean = `+${clean}`;
  }

  return `whatsapp:${clean}`;
}

async function sendWhatsAppMessage({
  studentName,
  studentPhone,
  summary = "",
  recommendation = "",
  universities = [],
  date = "",
  time = "",
  mode = "",
  meetingLink = "",
  notes = "",
}) {
  try {
    const to = formatWhatsAppNumber(studentPhone);

    if (!to) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // SIMPLE TEST MESSAGE FIRST
  const body = `Hi ${studentName || "Student"} 👋

Thank you for speaking with Fateh Education.

Call Summary:
${summary || "Your profile has been captured successfully."}

Recommendation:
${recommendation || "Our counsellor will guide you further."}

${
  universities.length
    ? `Suggested Universities:
${universities.join(", ")}\n`
    : ""
}

Meeting Details:
Date: ${date || "-"}
Time: ${time || "-"}
Mode: ${mode || "-"}
${meetingLink ? `Meeting Link: ${meetingLink}` : ""}
${notes ? `Notes: ${notes}` : ""}

Please be available on time.

Regards,
Fateh Education`;

    console.log("Sending WhatsApp to:", to);
    console.log("From:", process.env.TWILIO_WHATSAPP_FROM);
    console.log("Body:", body);

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body,
    });

    console.log("WhatsApp sent:", {
      sid: message.sid,
      status: message.status,
      to,
    });

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    };
  } catch (error) {
    console.error("WhatsApp send error full:", {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
    });

    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
    };
  }
}

module.exports = sendWhatsAppMessage;
