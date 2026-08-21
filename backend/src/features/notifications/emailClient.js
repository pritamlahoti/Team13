const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'Katalyst <onboarding@resend.dev>';

// Single choke point for all outbound email (mirrors aiCoach/geminiClient.js).
// Swallows failures — a Resend outage should never block the request that
// triggered the notification (same rule backend PRD 4.4 applies to Gemini).
async function sendEmail({ to, subject, text }) {
  if (!resend) {
    return false;
  }
  try {
    // The Resend SDK resolves with { data, error } on API-level failures
    // (bad address, unverified domain, etc.) rather than throwing — only
    // network/transport failures throw. Both cases must be checked.
    const { error } = await resend.emails.send({ from: FROM, to, subject, text });
    if (error) {
      console.error('Email send failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    return false;
  }
}

module.exports = { sendEmail };

