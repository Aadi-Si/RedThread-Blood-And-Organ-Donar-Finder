const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail(to, subject, html) {
  console.log("📧 sendEmail called with:", to);

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: {
        email: "voidadityasingh@gmail.com", // MUST be verified
        name: "RedThread",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    console.log("✅ Email sent:", response);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err.response?.body || err);
    return false;
  }
}

module.exports = sendEmail;