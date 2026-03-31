const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate', (req, res) => {
  const { prompt, mode } = req.body || {};

  if (!prompt || !mode) {
    return res.status(400).json({
      result: 'Missing prompt or mode.'
    });
  }

  let result = '';

  if (mode === 'cinematic-ad') {
    result = `CONCEPT TITLE:
${prompt}

CORE PROMPT:
Create a cinematic advertisement concept based on: ${prompt}

SCENE BREAKDOWN:
Scene 1:
Open with a strong cinematic visual that immediately establishes mood and premium tone.

Scene 2:
Introduce the main subject with stylish movement, texture, and atmosphere.

Scene 3:
Build intensity with a memorable visual transition or emotional beat.

CAMERA NOTES:
Use cinematic framing, premium close-ups, and smooth motion.

LIGHTING NOTES:
Use dramatic, polished lighting with contrast and depth.

STYLE KEYWORDS:
cinematic, premium, dramatic, polished

OPTIONAL VOICEOVER:
Bring the vision to life with confidence and emotion.`;
  } else if (mode === 'music-video') {
    result = `VIDEO TITLE:
${prompt}

VISUAL CONCEPT:
Create a music video concept based on: ${prompt}

MASTER VIDEO PROMPT:
Build a visually rich music video with emotional imagery, rhythmic movement, and strong scene progression.

SCENE BREAKDOWN:
Scene 1:
Establish the artist or lead figure in a memorable environment.

Scene 2:
Introduce motion, symbolism, or dancers that support the music.

Scene 3:
End with a strong image that feels emotionally complete.

PERFORMANCE NOTES:
Use expressive body language and visual rhythm.

LIGHTING + COLOR:
Stylized, rich, emotionally matched to the tone of the song.

STYLE KEYWORDS:
music video, expressive, stylish, rhythmic, cinematic`;
  } else if (mode === 'film-trailer') {
    result = `TRAILER TITLE:
${prompt}

TRAILER HOOK:
A powerful story begins with one unforgettable visual.

MASTER TRAILER PROMPT:
Create a dramatic film trailer concept based on: ${prompt}

TRAILER BEATS:
Beat 1:
Open with mystery, tension, or emotional pull.

Beat 2:
Reveal conflict, scale, or character stakes.

Beat 3:
End on a dramatic final image or line.

CAMERA NOTES:
Use bold cinematic angles, impactful cuts, and tension-building pacing.

LIGHTING + ATMOSPHERE:
Moody, dramatic, immersive.

OPTIONAL TAGLINE:
Some stories refuse to stay silent.`;
  } else if (mode === 'gospel-visual') {
    result = `VISION TITLE:
${prompt}

SPIRITUAL CONCEPT:
Create a gospel visual concept based on: ${prompt}

MASTER VISUAL PROMPT:
Build a faith-centered cinematic visual with symbolic imagery, emotional depth, and hope-filled atmosphere.

SYMBOLIC ELEMENTS:
Light, healing, renewal, spiritual authority, peace.

SCENE BREAKDOWN:
Scene 1:
Open with a strong symbolic image tied to faith and transformation.

Scene 2:
Show movement from struggle into hope or victory.

Scene 3:
End in peace, power, or worshipful resolution.

LIGHTING + MOOD:
Radiant, reverent, cinematic, uplifting.

STYLE KEYWORDS:
gospel, spiritual, uplifting, symbolic, cinematic`;
  } else if (mode === 'viral-short') {
    result = `SHORT TITLE:
${prompt}

VIRAL ANGLE:
Turn the main idea into a fast, scroll-stopping short with a strong hook and clear payoff.

MASTER SHORT PROMPT:
Create a viral short-form concept based on: ${prompt}

HOOK SHOT:
Open with an instant visual or text hook that makes people stop scrolling.

MIDDLE BEAT:
Introduce the transformation, contrast, or high-energy payoff.

ENDING BEAT:
Close with a memorable line, image, or CTA.

ON-SCREEN TEXT IDEA:
Make it short, bold, and instantly clear.

STYLE KEYWORDS:
fast cuts, hook-first, social-ready, engaging, high-impact`;
  } else {
    result = `CONCEPT TITLE:
${prompt}

CORE PROMPT:
Create a polished creative concept based on: ${prompt}

STYLE KEYWORDS:
cinematic, premium, structured, creative`;
  }

  res.json({ result });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Visyonix server is live 🚀' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
