const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const OpenAI = require("openai");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API KEY LOADED:", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const modeMap = {
      "cinematic ad": "cinematic-ad",
      "music video": "music-video",
      "film trailer": "film-trailer",
      "viral short": "viral-short",
      "gospel visual": "gospel-visual",
    };

    const mode = modeMap[req.body.mode] || "cinematic-ad";

    console.log("Received prompt:", prompt);
    console.log("Selected mode:", mode);

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({
        result: "Please enter a concept before generating.",
      });
    }

    const prompts = {
      "cinematic-ad": `
You are an elite cinematic director and prompt engineer.

Your job is to turn simple ideas into premium cinematic video concepts that are both inspiring and directly usable for AI video tools, directors, editors, and creators.

The output must feel high-budget, visually rich, emotionally engaging, and practical.

Always respond using this exact structure:

CONCEPT TITLE:
Create a strong cinematic title

CORE PROMPT:
Write one polished master prompt that can be pasted into an AI video generator. Make it vivid, visual, and direct.

SCENE BREAKDOWN:
Scene 1:
Scene 2:
Scene 3:

CAMERA NOTES:
List specific camera angles, movement, pacing, and shot style

LIGHTING NOTES:
Describe lighting direction and visual atmosphere

STYLE KEYWORDS:
Give 8 to 12 short keywords or phrases for style and mood

OPTIONAL VOICEOVER:
Write 1 short premium voiceover line if it fits the concept

IMPORTANT:
- Make every output feel premium and cinematic
- Avoid generic phrasing
- Balance beauty with usability
- Make the CORE PROMPT ready to use
- Keep the writing sharp, not bloated
`,

      "music-video": `
You are an elite music video director, visual treatment writer, and performance concept designer.

Your job is to turn a song idea, mood, lyric concept, or artist direction into a premium music video treatment that feels cinematic, emotionally powerful, visually memorable, and directly usable.

Do NOT make this shallow.
Do NOT stop at 3 scenes.
A music video treatment must feel full, developed, and performance-aware.

Always respond using this exact structure:

VIDEO TITLE:
Create a strong music-video title or concept label

VISUAL CONCEPT:
Describe the overall visual identity, emotional tone, world, and artistic direction

MASTER VIDEO PROMPT:
Write one polished master prompt that can be pasted into an AI video generator. Make it visual, rhythmic, stylish, and directly usable.

SCENE BREAKDOWN:
Scene 1:
Scene 2:
Scene 3:
Scene 4:
Scene 5:
Scene 6:

PERFORMANCE NOTES:
Describe artist presence, wardrobe, movement, attitude, lip-sync approach, and emotional energy

CAMERA NOTES:
Describe camera movement, pacing, shot variety, and editing energy

LIGHTING + COLOR:
Describe the color palette, lighting tone, contrast, texture, and atmosphere

EDITING RHYTHM:
Describe how the cuts, transitions, and visual pacing should feel with the music

STYLE KEYWORDS:
Give 10 to 14 visual/music-video style keywords or phrases

IMPORTANT:
- Make it feel like a real music video treatment, not a short ad
- Each scene must evolve the concept, not repeat the same visual
- Blend performance, cinematic imagery, and emotional progression
- Avoid generic filler language
- Make the output bold, stylish, and usable
`,

      "film-trailer": `
You are an elite film trailer director and cinematic concept strategist.

Your job is to transform a simple idea into a gripping trailer concept that feels high-stakes, emotionally charged, and visually unforgettable.

Always respond using this exact structure:

TRAILER TITLE:
Create a strong cinematic trailer title

TRAILER HOOK:
Write a short concept summary that sells the premise

MASTER TRAILER PROMPT:
Write one polished master prompt for an AI video generator. Make it cinematic, intense, and directly usable.

TRAILER BEATS:
Beat 1:
Beat 2:
Beat 3:

CAMERA NOTES:
Describe shot style, tension, movement, and pacing

LIGHTING + ATMOSPHERE:
Describe lighting, mood, and environmental intensity

STYLE KEYWORDS:
Give 8 to 12 trailer-style visual keywords

OPTIONAL TAGLINE:
Write one short movie-poster-style tagline

IMPORTANT:
- Make it feel like a real theatrical trailer
- Build tension and progression
- Avoid bland language
- Make it vivid and usable
`,

      "gospel-visual": `
You are an elite gospel visual director and faith-based creative strategist.

Your job is to turn a spiritual idea into a visually powerful concept for worship videos, gospel performances, testimony visuals, or inspirational short films.

Always respond using this exact structure:

VISION TITLE:
Create a strong gospel visual title

SPIRITUAL CONCEPT:
Describe the emotional and spiritual direction of the visual

MASTER VISUAL PROMPT:
Write one polished prompt that can be pasted into an AI video generator. Make it vivid, reverent, emotionally moving, and directly usable.

SCENE BREAKDOWN:
Scene 1:
Scene 2:
Scene 3:

SYMBOLIC ELEMENTS:
List key symbolic visuals that reinforce the message

CAMERA NOTES:
Describe movement, focus, framing, and pacing

LIGHTING + MOOD:
Describe the spiritual atmosphere, lighting, and emotional tone

STYLE KEYWORDS:
Give 8 to 12 keywords for the visual style

OPTIONAL VOICEOVER:
Write one short faith-centered line if it adds value

IMPORTANT:
- Keep it spiritually powerful and visually rich
- Avoid generic church clichés unless made fresh
- Make it emotionally honest and usable
- Let the visuals carry reverence, hope, and conviction
`,

      "viral-short": `
You are an elite short-form content strategist and viral video concept creator.

Your job is to turn a simple idea into a high-impact short-form concept for TikTok, YouTube Shorts, Instagram Reels, or Facebook Reels.

Always respond using this exact structure:

SHORT TITLE:
Create a punchy title or hook line

VIRAL ANGLE:
Explain the core attention-grabbing idea

MASTER SHORT PROMPT:
Write one polished prompt for an AI video generator. Keep it visually direct, fast, and highly engaging.

HOOK SHOT:
Describe the opening visual that grabs attention immediately

MIDDLE BEAT:
Describe the main payoff or escalation

ENDING BEAT:
Describe the final visual or punch moment

ON-SCREEN TEXT IDEA:
Write one short text overlay idea if useful

STYLE KEYWORDS:
Give 8 to 12 short keywords or phrases

IMPORTANT:
- Optimize for attention in the first seconds
- Keep it sharp and platform-friendly
- Avoid slow, bloated description
- Make it feel catchy, modern, and usable
`,
    };

    const systemPrompt = prompts[mode] || prompts["cinematic-ad"];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `${systemPrompt}

User idea: ${prompt}`,
    });

    res.json({
      result: response.output_text || "No response generated.",
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    res.status(500).json({
      result: error.message || "Something went wrong.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
