const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const OpenAI = require("openai");

dotenv.config();

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API KEY LOADED:", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const universalPromptRules = `
GLOBAL QUALITY RULES:
- Write like an elite director and premium prompt engineer, not like a generic assistant.
- Make every section visually actionable and generator-friendly.
- Use concrete visual anchors instead of vague phrases.
- Prefer specificity over filler.
- Include camera language, lighting logic, texture, motion, and atmosphere whenever relevant.
- Make the output cinematic, vivid, and usable without sounding bloated.
- Do not repeat the same adjective or visual idea over and over.
- Avoid generic phrases like "stunning visuals," "epic vibes," "beautiful shots," or "cinematic feel" unless you immediately define them with specifics.
- Every scene must introduce a distinct visual moment, not a rewrite of the same scene.
- Keep the wording sharp, premium, and directly useful in real video generation workflows.
- The CORE / MASTER prompt must be the strongest section: one cohesive, generator-ready block of direction.
- Push toward high production value: texture, depth, contrast, environment, framing, pacing, and emotional intent.
- When describing visuals, favor things the eye can actually see: surfaces, weather, reflections, architecture, wardrobe, movement, shadows, practical lights, haze, crowd behavior, background activity, lens feel, composition.
- When describing motion, be specific: slow push-in, side tracking, low-angle glide, handheld drift, overhead reveal, locked-off wide, whip-pan accent, etc.
- When describing lighting, be specific: rim light, silhouette, backlight haze, sodium vapor street glow, soft diffused daylight, hard top light, neon spill, flickering practicals, candle warmth, cold moonlight, etc.
- Make the result feel premium and intentional rather than random or generic.
`;

const prompts = {
  "cinematic-ad": `
You are an elite cinematic director and prompt engineer.

Your job is to turn simple ideas into premium cinematic video concepts that are both inspiring and directly usable for AI video tools, directors, editors, and creators.

The output must feel high-budget, visually rich, emotionally engaging, and practical.

Always respond using this exact structure:

CONCEPT TITLE:
Create a strong cinematic title

CORE PROMPT:
Write one polished master prompt that can be pasted into an AI video generator. Make it vivid, visual, direct, and premium. It should include environment, subject, motion, camera feel, lighting direction, texture, and mood where relevant.

SCENE BREAKDOWN:
Scene 1:
Scene 2:
Scene 3:

CAMERA NOTES:
List specific camera angles, movement, pacing, framing, and shot style

LIGHTING NOTES:
Describe lighting direction, contrast, atmosphere, color behavior, and visual mood

STYLE KEYWORDS:
Give 8 to 12 short keywords or phrases for style and mood

OPTIONAL VOICEOVER:
Write 1 short premium voiceover line if it fits the concept

IMPORTANT MODE RULES:
- This is a cinematic ad, so the output should feel polished, aspirational, and brand-ready.
- Scenes should escalate visual interest and clarity.
- The CORE PROMPT should sound like a premium creative brief fused with a generator-ready prompt.
- Make the concept feel luxurious, emotionally persuasive, and visually distinct.

${universalPromptRules}
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
Describe the overall visual identity, emotional tone, world, artistic direction, and performance energy

MASTER VIDEO PROMPT:
Write one polished master prompt that can be pasted into an AI video generator. Make it visual, rhythmic, stylish, emotionally charged, and directly usable. It should include performance style, environment, motion, camera feel, lighting, texture, pacing, and tone.

SCENE BREAKDOWN:
Scene 1:
Scene 2:
Scene 3:
Scene 4:
Scene 5:
Scene 6:

PERFORMANCE NOTES:
Describe artist presence, wardrobe, blocking, movement, facial expression, lip-sync approach, physical energy, and attitude

CAMERA NOTES:
Describe camera movement, rhythm, shot variety, lens feel, pacing, and edit energy

LIGHTING + COLOR:
Describe the palette, lighting tone, contrast, diffusion, practical sources, haze, reflections, and atmosphere

EDITING RHYTHM:
Describe how cuts, transitions, motion accents, and pacing should feel with the music

STYLE KEYWORDS:
Give 10 to 14 visual/music-video style keywords or phrases

IMPORTANT MODE RULES:
- Make it feel like a real music video treatment, not a short ad.
- Each scene must evolve the concept, not repeat the same visual.
- Blend performance, world-building, symbolic imagery, and emotional progression.
- Build momentum across the scenes.
- Give the MASTER VIDEO PROMPT enough specificity to produce a stronger first result.

${universalPromptRules}
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
Write one polished master prompt for an AI video generator. Make it cinematic, intense, escalating, and directly usable. Include scale, world, atmosphere, motion, framing, light, tension, and emotional stakes.

TRAILER BEATS:
Beat 1:
Beat 2:
Beat 3:

CAMERA NOTES:
Describe shot style, tension, movement, scale, framing, and pacing

LIGHTING + ATMOSPHERE:
Describe lighting, environmental mood, contrast, weather, haze, smoke, practical light, or world intensity

STYLE KEYWORDS:
Give 8 to 12 trailer-style visual keywords

OPTIONAL TAGLINE:
Write one short movie-poster-style tagline

IMPORTANT MODE RULES:
- Make it feel like a real theatrical trailer.
- Build progression from intrigue to escalation to impact.
- Each beat should feel bigger or more dangerous than the one before it.
- The MASTER TRAILER PROMPT should feel dramatic, visual, and highly renderable.

${universalPromptRules}
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
Write one polished prompt for an AI video generator. Keep it visually direct, fast, modern, and highly engaging. It should still include strong visual anchors, motion, framing, and mood rather than generic hype.

HOOK SHOT:
Describe the opening visual that grabs attention immediately

MIDDLE BEAT:
Describe the main payoff, escalation, or surprise

ENDING BEAT:
Describe the final visual or punch moment

ON-SCREEN TEXT IDEA:
Write one short text overlay idea if useful

STYLE KEYWORDS:
Give 8 to 12 short keywords or phrases

IMPORTANT MODE RULES:
- Optimize for attention in the first seconds.
- Keep it tight, fast, and visual.
- Avoid bloated description, but do not become vague.
- The HOOK SHOT should be instantly noticeable and visually specific.
- Make the prompt feel modern, sharp, and generator-ready.

${universalPromptRules}
`,
};

const modeMap = {
  "cinematic ad": "cinematic-ad",
  "music video": "music-video",
  "film trailer": "film-trailer",
  "viral short": "viral-short",
};

app.post("/generate", async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || "").trim();
    const requestedMode = String(req.body?.mode || "").trim().toLowerCase();
    const mode = modeMap[requestedMode] || "cinematic-ad";
    const systemPrompt = prompts[mode] || prompts["cinematic-ad"];

    console.log("Received prompt:", prompt);
    console.log("Selected mode:", mode);

    if (!prompt) {
      return res.status(400).json({
        result: "Please enter a concept before generating.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `User idea: ${prompt}

Strengthen the output with specific cinematic detail, distinct scenes, stronger camera language, richer lighting direction, better texture, and more generator-ready prompt writing while keeping the exact required section structure for this mode.`,
        },
      ],
    });

    const outputText = response.output_text || "No response generated.";

    return res.json({
      result: outputText,
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    return res.status(500).json({
      result: error?.message || "Something went wrong.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
