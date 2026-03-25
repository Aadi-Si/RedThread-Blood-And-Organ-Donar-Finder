const axios = require("axios");

async function sendEmail(to, subject, html) {
  console.log("📧 sendEmail called with:", to);

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "voidadityasingh@gmail.com", // MUST be verified in Brevo
          name: "RedThread",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err.response?.data || err.message);
    return false;
  }
}

module.exports = sendEmail;