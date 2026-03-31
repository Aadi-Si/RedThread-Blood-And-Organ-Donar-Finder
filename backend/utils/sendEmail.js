const axios = require("axios");

async function sendEmail(to, subject, html) {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "voidadityasingh@gmail.com",
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
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = sendEmail;