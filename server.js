require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.json({
        success: false,
        error: "No prompt provided"
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Create 3 high-quality prompt outputs for this idea:

${prompt}

Return ONLY JSON:
{
  "results": [
    { "title": "Option 1", "content": "..." },
    { "title": "Option 2", "content": "..." },
    { "title": "Option 3", "content": "..." }
  ]
}`
    });

    const text = response.output_text;

    if (!text) {
      return res.json({
        success: false,
        error: "No response from AI"
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({
        success: false,
        error: "Bad JSON from AI",
        raw: text
      });
    }

    res.json({
      success: true,
      results: data.results
    });

  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
