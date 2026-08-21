// Single choke point for all Gemini calls (backend PRD section 4.4) — retry/
// timeout/error-handling lives here once instead of duplicated per route.
// gemini-2.0-flash and gemini-2.5-flash are both retired for this API key.
// gemini-3.6-flash (Google's suggested replacement) is a thinking model and
// blew the 9s timeout on simple feedback text; flash-lite has no thinking
// step and responds in under 2s, which fits this route's latency budget.
const MODEL = 'gemini-3.1-flash-lite';
const TIMEOUT_MS = 9000;

async function generateText(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal,
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { generateText };
