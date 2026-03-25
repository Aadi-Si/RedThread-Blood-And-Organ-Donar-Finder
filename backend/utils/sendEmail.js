const SibApiV3Sdk = require('@getbrevo/brevo');

// Setup API client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create email API instance
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(to, subject, html) {
  console.log("📧 sendEmail called with:", to);

  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: "voidadityasingh@gmail.com",
        name: "redthread"
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