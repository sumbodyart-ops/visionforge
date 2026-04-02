require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve frontend files
app.use(express.static(__dirname));

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "VisionForge server is running" });
});

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Prompt generation route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are VisionForge, an expert AI prompt engineer.
Turn the user's simple idea into multiple clean, high-quality creative prompt outputs.

Return JSON only in this exact format:
{
  "results": [
    {
      "title": "Prompt 1",
      "content": "Full prompt text here"
    },
    {
      "title": "Prompt 2",
      "content": "Full prompt text here"
    },
    {
      "title": "Prompt 3",
      "content": "Full prompt text here"
    }
  ]
}

Rules:
- Create exactly 3 results
- Make each result distinct and useful
- Keep titles short
- Do not include markdown
- Do not include commentary outside JSON
          `.trim(),
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        success: false,
        error: "No response received from OpenAI.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        error: "OpenAI returned invalid JSON.",
        raw,
      });
    }

    if (!parsed.results || !Array.isArray(parsed.results)) {
      return res.status(500).json({
        success: false,
        error: "OpenAI response format was incorrect.",
        raw: parsed,
      });
    }

    res.json({
      success: true,
      results: parsed.results,
    });
  } catch (error) {
    console.error("Generate error:", error);

    res.status(500).json({
      success: false,
      error:
        error?.message || "Something went wrong while generating prompts.",
    });
  }
});

// Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
