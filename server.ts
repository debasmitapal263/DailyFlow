import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to categorize task as 'Deep Work', 'Admin', or 'Recovery'
app.post('/api/classify-task', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required' });
    }

    const prompt = `You are an expert cognitive scheduling assistant for DayFlow, an intelligent daily planner.
Analyze the following task and categorize it into exactly one of these three cognitive energy categories:
- "Deep Work": High-focus, intellectually demanding pursuits requiring sustained cognitive synthesis, analytical reasoning, technical problem-solving, or creative flow (e.g., algorithmic programming, academic research, thesis writing, manuscript drafting, lab data analysis, system architecture, strategy).
- "Admin": Operational, routine, logistical, or communicative tasks requiring moderate-to-low cognitive effort (e.g., replying to emails, filling forms, ordering equipment, scheduling calendar invitations, paying bills, filing expense reports, organizing files, errands).
- "Recovery": Somatic, restorative, physical, or decompression activities intended to replenish energy, lower cortisol, and safeguard well-being (e.g., meditation, lunch or coffee break, botanical garden walk, gym mobility session, dinner unwind, reading for pleasure, stretching, sleep wind-down).

Task Title: ${title || 'Untitled Task'}
Task Description / Context: ${description || 'No additional notes provided'}

Return a JSON object conforming to the schema with:
- tag: Exactly one of "Deep Work", "Admin", or "Recovery"
- reason: A concise 1-sentence justification explaining why this category fits the cognitive demand.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a precise cognitive workload classification engine. Categorize tasks accurately based on mental energy requirements.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tag: {
              type: Type.STRING,
              description: "Must be 'Deep Work', 'Admin', or 'Recovery'",
            },
            reason: {
              type: Type.STRING,
              description: 'A concise 1-sentence reason for the classification',
            },
          },
          required: ['tag'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    let normalizedTag: 'Deep Work' | 'Admin' | 'Recovery' = 'Deep Work';
    if (parsed.tag === 'Admin') normalizedTag = 'Admin';
    else if (parsed.tag === 'Recovery') normalizedTag = 'Recovery';

    res.json({
      tag: normalizedTag,
      reason: parsed.reason || 'Classified based on cognitive effort profile.',
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error classifying task with Gemini API:', error);

    // Reliable fallback heuristic if API key is not yet set up in environment
    const text = `${req.body.title || ''} ${req.body.description || ''}`.toLowerCase();
    let fallbackTag: 'Deep Work' | 'Admin' | 'Recovery' = 'Deep Work';
    let reason = 'High cognitive load synthesis detected.';

    if (text.match(/email|bill|chore|sync|buy|order|admin|inbox|meeting|supervision|file|submit/)) {
      fallbackTag = 'Admin';
      reason = 'Routine operational and communication activity.';
    } else if (text.match(/walk|rest|nap|sleep|eat|lunch|dinner|break|stretch|meditat|coffee|mindful/)) {
      fallbackTag = 'Recovery';
      reason = 'Restorative physical or somatic decompression.';
    }

    res.json({
      tag: fallbackTag,
      reason,
      fallback: true,
    });
  }
});

const port = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`DayFlow server active on http://0.0.0.0:${port}`);
  });
}

startServer();
