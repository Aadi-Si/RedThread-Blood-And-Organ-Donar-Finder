const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"RedThread" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent to:', to)
    return true
  } catch (err) {
    console.log('Email error:', err.message)
    return false
  }
}

module.exports = sendEmail