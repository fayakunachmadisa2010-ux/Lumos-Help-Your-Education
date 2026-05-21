/* =====================================================
   LUMOS — server.js
   Backend API Server
   Endpoints:
   - POST /api/summarize  { text, lang } → { summary }
   - POST /api/quiz       { text, lang, count } → { questions }
   ===================================================== */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3001;

/* ---- Middleware ---- */
// Allow all origins for local development (frontend opened via file:// or any localhost port)
app.use(
  cors({
    origin: true, // reflect the request origin — allows file://, localhost:*, etc.
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  }),
);
app.options("*", cors()); // handle preflight
app.use(express.json({ limit: "2mb" }));

/* ---- Gemini Client ---- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/* ---- Health check ---- */
app.get("/api/health", (req, res) => {
  const hasKey = !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  );
  res.json({ status: "ok", keyConfigured: hasKey });
});

/* ---- Root route (friendly info page) ---- */
app.get("/", (req, res) => {
  const hasKey = !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  );
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>LUMOS Backend</title>
      <style>
        body { font-family: sans-serif; max-width: 500px; margin: 80px auto; padding: 24px;
               background: #0d0e1a; color: #eceef8; }
        h1 { color: #6b5ce7; }
        .ok { color: #22c55e; } .warn { color: #f59e0b; }
        code { background: #1c1e32; padding: 4px 8px; border-radius: 6px; font-size: 0.9em; }
        ul { line-height: 2; }
      </style>
    </head>
    <body>
      <h1>🌟 LUMOS Backend</h1>
      <p>Server berjalan dengan baik di port <strong>${PORT}</strong>.</p>
      <p>API Key: <span class="${hasKey ? "ok" : "warn"}">${hasKey ? "✅ Terkonfigurasi" : "⚠️ Belum diisi di .env"}</span></p>
      <h3>Endpoints tersedia:</h3>
      <ul>
        <li><code>POST /api/summarize</code> — Rangkum teks</li>
        <li><code>POST /api/quiz</code> — Buat soal kuis</li>
        <li><code>GET /api/health</code> — Cek status</li>
      </ul>
      <p><em>Buka <strong>index.html</strong> di browser untuk menggunakan aplikasi.</em></p>
    </body>
    </html>
  `);
});

/* ==================================================
   POST /api/summarize
   Body: { text: string, lang: 'en' | 'id' }
   Returns: { summary: string }
   ================================================== */
app.post("/api/summarize", async (req, res) => {
  const { text, lang = "en" } = req.body;

  if (!text || text.trim().length < 20) {
    return res.status(400).json({
      error: "Text too short. Please provide at least 20 characters.",
    });
  }

  const langInstruction =
    lang === "id"
      ? "Jawab SELURUHNYA dalam Bahasa Indonesia."
      : "Respond ENTIRELY in English.";

  const prompt = `${langInstruction}

Buat ringkasan yang komprehensif dari teks berikut. Format output dengan:
- **Poin Utama**: 3-5 poin penting dalam bentuk bullet points
- **Ringkasan**: Paragraf singkat (2-3 kalimat) yang merangkum keseluruhan isi
- **Kata Kunci**: 5-8 kata kunci penting

Teks:
"""
${text.trim()}
"""`;

  try {
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ summary });
  } catch (err) {
    console.error("[summarize] Gemini error:", err.message);
    res.status(500).json({
      error:
        "Failed to generate summary. Please check your API key and try again.",
    });
  }
});

/* ==================================================
   POST /api/quiz
   Body: { text: string, lang: 'en' | 'id', count: number }
   Returns: { questions: [ { question, options:[A,B,C,D], answer, explanation } ] }
   ================================================== */
app.post("/api/quiz", async (req, res) => {
  const { text, lang = "en", count = 5 } = req.body;
  const numQuestions = Math.min(Math.max(parseInt(count) || 5, 3), 20);

  if (!text || text.trim().length < 50) {
    return res.status(400).json({
      error:
        "Text too short. Please provide at least 50 characters for quiz generation.",
    });
  }

  const langInstruction =
    lang === "id"
      ? "Semua pertanyaan, pilihan, dan penjelasan HARUS dalam Bahasa Indonesia."
      : "All questions, options, and explanations MUST be in English.";

  const prompt = `${langInstruction}

Buat ${numQuestions} soal pilihan ganda dari teks berikut. 

SANGAT PENTING: Kembalikan HANYA JSON yang valid tanpa teks tambahan apapun, tanpa markdown, tanpa penjelasan sebelum atau sesudah JSON.

Format JSON yang harus dikembalikan:
[
  {
    "question": "Pertanyaan di sini?",
    "options": ["A. Pilihan A", "B. Pilihan B", "C. Pilihan C", "D. Pilihan D"],
    "answer": "A",
    "explanation": "Penjelasan singkat mengapa A benar."
  }
]

Aturan:
- Setiap soal punya tepat 4 pilihan (A, B, C, D)
- Field "answer" hanya berisi huruf: "A", "B", "C", atau "D"
- Soal harus berdasarkan konten dari teks yang diberikan
- Variasikan tingkat kesulitan

Teks:
"""
${text.trim()}
"""`;

  try {
    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();

    // Strip markdown code blocks if present
    raw = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    let questions;
    try {
      questions = JSON.parse(raw);
    } catch (parseErr) {
      // Try to extract JSON array from the response
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from Gemini: " + raw.substring(0, 200));
      }
    }

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Unexpected response structure from Gemini");
    }

    res.json({ questions });
  } catch (err) {
    console.error("[quiz] Error:", err.message);
    res.status(500).json({
      error: "Failed to generate quiz. Please try again with different text.",
    });
  }
});

/* ---- Start server ---- */
app.listen(PORT, () => {
  console.log(`\nLUMOS Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);

  const hasKey = !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  );
  if (hasKey) {
    console.log(`   Gemini API key configured\n`);
  } else {
    console.log(
      `   No Gemini API key found! Edit .env file and set GEMINI_API_KEY\n`,
    );
  }
});
module.exports = app;
