const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const SUBSCRIBERS = [
  "workonprojects24@gmail.com"
];

async function sendEmail(html, topics) {
  const subject = topics.length === 1
    ? `🏛️ Agora Daily Debate — ${topics[0].slice(0, 50)}...`
    : `🏛️ Agora Daily Digest — ${new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long" })}`;

  console.log(`\n📧 Sending email to ${SUBSCRIBERS.length} subscriber(s)...`);

  for (const email of SUBSCRIBERS) {
    try {
      await transporter.sendMail({
        from: `"🏛️ Agora Debates" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${email}:`, error.message);
    }
  }
}

async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Gmail connection verified!");
    return true;
  } catch (error) {
    console.error("❌ Gmail connection failed:", error.message);
    return false;
  }
}

module.exports = { sendEmail, testEmailConnection, SUBSCRIBERS };
