/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Manual Digital Agrícola de Sopachuy - Backend Server
 * Express Server with Vite Middleware and Gemini API integrations.
 */

import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared server-side Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for the Sopachuy agricultural advisor
const AGRONOMIST_SYSTEM_INSTRUCTION = `
Eres el Asistente Técnico Agrónomo del "Manual Digital Agrícola de Sopachuy" (Municipio de Sopachuy, Provincia Tomina, Departamento de Chuquisaca, Bolivia), desarrollado por el estudiante Claudio Jimenez Aramayo (6to A, Sistemas Informáticos).

Tu misión es brindar asesoramiento agroecológico, práctico y accesible a los productores agrícolas, jóvenes y estudiantes rurales de las comunidades de Sopachuy.
Contexto agroclimático fundamental:
- Clima de valle interandino (2000 a 2400 msnm), templado.
- Época de lluvias: Diciembre a Marzo.
- Época seca y de frío/heladas: Mayo a Agosto (con vientos en Agosto).
- Siembra temprana ('mishka'): Septiembre - Octubre bajo riego de canales comunales.
- Siembra principal grande de papa y maíz: Octubre - Noviembre con las primeras lluvias.
- Cosechas principales: Febrero - Abril.
- Cultivos tradicionales: Papa (Imilla, Huaycha, Desirée), Maíz (Choclero, Blanco criollo), Trigo de invierno, Durazno de valle, Hortalizas (Cebolla, Tomate).
- Plagas frecuentes: Gusano cogollero (Spodoptera frugiperda), Polilla de la papa, Tizón tardío (lancha), Pulgones.

Directrices de respuesta:
1. Responde siempre con tono cálido, respetuoso y pedagógico, usando lenguaje claro y directo para agricultores.
2. Prioriza métodos agroecológicos, orgánicos y de bajo costo (estiércol fermentado, caldos minerales como caldo bordelés, bioles caseros, ceniza vegetal, plantas repelentes, rotación de cultivos).
3. Cuando sea pertinente, incluye términos en Quechua (ej. Allpa, Yaku, Tarpuy, Aymoray, Wanu, Hallmay) para facilitar la adopción comunitaria.
4. Responde con puntos concretos, pasos numerados fáciles de seguir en el campo y advertencias preventivas.
`;

/**
 * Multi-turn Gemini Chat Endpoint
 */
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, modelChoice = 'gemini-3.8-flash' } = req.body;

    if (!apiKey) {
      res.status(500).json({ error: 'La clave GEMINI_API_KEY no está configurada en las variables de entorno.' });
      return;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Debe proporcionar un historial de mensajes válido.' });
      return;
    }

    // Select model according to user choice:
    // 'gemini-4-argon' for complex tasks, 'gemini-3.8-flash' general, 'gemini-3.1-flash-lite' fast
    let selectedModel = 'gemini-3.8-flash';
    if (modelChoice === 'gemini-4-argon') {
      selectedModel = 'gemini-4-argon';
    } else if (modelChoice === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    // Convert messages into contents format for generateContent
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: AGRONOMIST_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'No se pudo generar respuesta en este momento.';
    res.json({ reply: replyText, modelUsed: selectedModel });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'Error procesando la consulta agrícola con Gemini.',
    });
  }
});

/**
 * Text-to-Speech Endpoint using gemini-3.8-flash-tts
 */
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'El campo texto es requerido.' });
      return;
    }

    // Limit text length for TTS response speed
    const sanitizedText = text.slice(0, 1200);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: sanitizedText,
              speechMetadata: {
                style: 'Voz clara, pausada y amena de técnico extensionista agrónomo rural en español boliviano',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({ error: 'No se generó audio en la respuesta del modelo.' });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({
      error: error?.message || 'Error al generar síntesis de voz con gemini-3.8-flash-tts.',
    });
  }
});

/**
 * High-Quality Image Generation Endpoint with Gemini + Botanical SVG Fallback
 * Supports user-specified imageSize: 1K, 2K, 4K
 */
function generateAgriculturalIllustrationSvg(prompt: string, size: string): string {
  const isMaiz = /ma[ií]z/i.test(prompt);
  const isPapa = /papa/i.test(prompt);
  const isTrigo = /trigo/i.test(prompt);
  const isPest = /gusano|plaga|tiz[oó]n|polilla|pulg[oó]n|hongo|insect/i.test(prompt);
  const isDurazno = /durazn|frutal/i.test(prompt);
  const isHaba = /haba|legum/i.test(prompt);

  const title = prompt.length > 40 ? prompt.slice(0, 37) + '...' : prompt;
  
  let botanicalName = 'Especie adaptada al valle de Sopachuy';
  let primaryColor = '#16a34a';
  let elementSvg = '';

  if (isPapa) {
    botanicalName = 'Solanum tuberosum L. (Papa Imilla / Huaycha)';
    primaryColor = '#7c2d12';
    elementSvg = `
      <g transform="translate(400, 340)">
        <path d="M0,0 Q-40,-120 -80,-160" stroke="#15803d" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M0,0 Q0,-140 10,-200" stroke="#16a34a" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M0,0 Q50,-110 90,-150" stroke="#15803d" stroke-width="8" fill="none" stroke-linecap="round"/>
        <ellipse cx="-80" cy="-160" rx="35" ry="18" fill="#166534" transform="rotate(-30 -80 -160)"/>
        <ellipse cx="10" cy="-200" rx="40" ry="22" fill="#22c55e" transform="rotate(15 10 -200)"/>
        <ellipse cx="90" cy="-150" rx="36" ry="19" fill="#15803d" transform="rotate(25 90 -150)"/>
        <ellipse cx="-40" cy="-80" rx="30" ry="15" fill="#15803d" transform="rotate(-15 -40 -80)"/>
        <ellipse cx="50" cy="-75" rx="30" ry="15" fill="#16a34a" transform="rotate(20 50 -75)"/>
        <circle cx="10" cy="-215" r="10" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
        <circle cx="10" cy="-215" r="3.5" fill="#facc15"/>
        <ellipse cx="-55" cy="45" rx="38" ry="26" fill="#78350f" stroke="#5c2605" stroke-width="3" transform="rotate(-10 -55 45)"/>
        <circle cx="-65" cy="40" r="2" fill="#451a03"/>
        <circle cx="-45" cy="50" r="2" fill="#451a03"/>
        <ellipse cx="45" cy="55" rx="44" ry="28" fill="#854d0e" stroke="#5c2605" stroke-width="3" transform="rotate(15 45 55)"/>
        <circle cx="35" cy="50" r="2" fill="#451a03"/>
        <circle cx="55" cy="60" r="2" fill="#451a03"/>
        <ellipse cx="-5" cy="70" rx="35" ry="24" fill="#a16207" stroke="#78350f" stroke-width="2"/>
      </g>
    `;
  } else if (isMaiz) {
    botanicalName = 'Zea mays L. (Maíz Choclero y Blanco Criollo)';
    primaryColor = '#ca8a04';
    elementSvg = `
      <g transform="translate(400, 360)">
        <path d="M0,0 Q-10,-150 0,-280" stroke="#15803d" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M-5,-100 Q-120,-160 -180,-110" stroke="#16a34a" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M5,-130 Q120,-190 180,-140" stroke="#22c55e" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M-5,-190 Q-100,-250 -150,-210" stroke="#15803d" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M5,-210 Q100,-270 150,-240" stroke="#16a34a" stroke-width="8" fill="none" stroke-linecap="round"/>
        <g transform="translate(25, -140) rotate(20)">
          <ellipse cx="0" cy="0" rx="22" ry="50" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="-10" cy="-25" r="3.5" fill="#eab308"/>
          <circle cx="0" cy="-25" r="3.5" fill="#fef08a"/>
          <circle cx="10" cy="-25" r="3.5" fill="#eab308"/>
          <circle cx="-10" cy="-10" r="3.5" fill="#eab308"/>
          <circle cx="0" cy="-10" r="3.5" fill="#fef08a"/>
          <circle cx="10" cy="-10" r="3.5" fill="#eab308"/>
          <circle cx="-10" cy="5" r="3.5" fill="#eab308"/>
          <circle cx="0" cy="5" r="3.5" fill="#fef08a"/>
          <circle cx="10" cy="5" r="3.5" fill="#eab308"/>
          <circle cx="-10" cy="20" r="3.5" fill="#eab308"/>
          <circle cx="0" cy="20" r="3.5" fill="#fef08a"/>
          <circle cx="10" cy="20" r="3.5" fill="#eab308"/>
          <path d="M-22,-10 Q-30,45 0,55 Q30,45 22,-10 Q10,35 -22,-10 Z" fill="#65a30d" opacity="0.9"/>
          <path d="M-5,-50 Q-10,-70 -5,-80 M0,-50 Q5,-75 10,-85 M5,-50 Q15,-70 20,-75" stroke="#b45309" stroke-width="1.8" fill="none"/>
        </g>
        <path d="M0,-280 Q-20,-320 -35,-335 M0,-280 Q0,-325 0,-340 M0,-280 Q20,-320 35,-335" stroke="#ca8a04" stroke-width="3" fill="none"/>
      </g>
    `;
  } else if (isPest) {
    botanicalName = 'Diagnóstico Fitosanitario y Control Agroecológico';
    primaryColor = '#b91c1c';
    elementSvg = `
      <g transform="translate(400, 290)">
        <path d="M-150,50 Q-60,-120 120,-90 Q150,60 -150,50 Z" fill="#4ade80" stroke="#16a34a" stroke-width="3"/>
        <path d="M-150,50 Q-20,-20 120,-90" stroke="#15803d" stroke-width="3" fill="none"/>
        <circle cx="-20" cy="-10" r="22" fill="#78350f" opacity="0.8"/>
        <circle cx="40" cy="-40" r="16" fill="#451a03" opacity="0.85"/>
        <circle cx="65" cy="-25" r="12" fill="#92400e" opacity="0.75"/>
        <g transform="translate(-10, 20) rotate(-15)">
          <ellipse cx="-40" cy="0" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <ellipse cx="-22" cy="3" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <ellipse cx="-4" cy="5" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <ellipse cx="14" cy="4" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <ellipse cx="32" cy="1" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <ellipse cx="50" cy="-2" rx="12" ry="10" fill="#65a30d" stroke="#365314" stroke-width="2"/>
          <circle cx="62" cy="0" r="11" fill="#4d7c0f" stroke="#1a2e05" stroke-width="2"/>
          <circle cx="66" cy="-3" r="2" fill="#1e293b"/>
          <path d="M68,-8 Q75,-16 78,-20 M64,-10 Q68,-18 70,-22" stroke="#1a2e05" stroke-width="1.8" fill="none"/>
        </g>
        <g transform="translate(140, 40)">
          <path d="M0,-20 L25,-10 L25,15 Q0,35 -25,15 L-25,-10 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
          <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">!</text>
        </g>
      </g>
    `;
  } else if (isDurazno) {
    botanicalName = 'Prunus persica (L.) Batsch (Duraznero de Valle)';
    primaryColor = '#ea580c';
    elementSvg = `
      <g transform="translate(400, 310)">
        <path d="M-180,-80 Q-60,0 160,-40" stroke="#78350f" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M-30,-25 Q30,50 80,60" stroke="#854d0e" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="-120" cy="-90" rx="35" ry="12" fill="#15803d" transform="rotate(-25 -120 -90)"/>
        <ellipse cx="-40" cy="-40" rx="40" ry="14" fill="#16a34a" transform="rotate(35 -40 -40)"/>
        <ellipse cx="110" cy="-60" rx="35" ry="13" fill="#22c55e" transform="rotate(-15 110 -60)"/>
        <g transform="translate(10, 30)">
          <circle cx="-5" cy="0" r="38" fill="#f97316"/>
          <circle cx="8" cy="0" r="38" fill="#fb923c"/>
          <path d="M0,-35 C-3,-10 3,10 0,35" stroke="#ea580c" stroke-width="3" fill="none"/>
          <circle cx="-10" cy="-10" r="10" fill="#fef08a" opacity="0.6"/>
        </g>
      </g>
    `;
  } else if (isTrigo) {
    botanicalName = 'Triticum aestivum L. (Trigo Criollo de Sopachuy)';
    primaryColor = '#d97706';
    elementSvg = `
      <g transform="translate(400, 360)">
        <path d="M0,0 Q-15,-140 0,-270" stroke="#ca8a04" stroke-width="8" fill="none"/>
        <g transform="translate(0, -220)"><ellipse cx="-14" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#b45309" stroke-width="1.8" transform="rotate(-30 -14 0)"/><ellipse cx="14" cy="0" rx="12" ry="6" fill="#fde047" stroke="#b45309" stroke-width="1.8" transform="rotate(30 14 0)"/><path d="M-24,0 L-55,-20 M24,0 L55,-20" stroke="#b45309" stroke-width="1.5"/></g>
        <g transform="translate(0, -180)"><ellipse cx="-14" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#b45309" stroke-width="1.8" transform="rotate(-30 -14 0)"/><ellipse cx="14" cy="0" rx="12" ry="6" fill="#fde047" stroke="#b45309" stroke-width="1.8" transform="rotate(30 14 0)"/><path d="M-24,0 L-55,-20 M24,0 L55,-20" stroke="#b45309" stroke-width="1.5"/></g>
        <g transform="translate(0, -140)"><ellipse cx="-14" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#b45309" stroke-width="1.8" transform="rotate(-30 -14 0)"/><ellipse cx="14" cy="0" rx="12" ry="6" fill="#fde047" stroke="#b45309" stroke-width="1.8" transform="rotate(30 14 0)"/><path d="M-24,0 L-55,-20 M24,0 L55,-20" stroke="#b45309" stroke-width="1.5"/></g>
        <g transform="translate(0, -100)"><ellipse cx="-14" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#b45309" stroke-width="1.8" transform="rotate(-30 -14 0)"/><ellipse cx="14" cy="0" rx="12" ry="6" fill="#fde047" stroke="#b45309" stroke-width="1.8" transform="rotate(30 14 0)"/><path d="M-24,0 L-55,-20 M24,0 L55,-20" stroke="#b45309" stroke-width="1.5"/></g>
      </g>
    `;
  } else {
    botanicalName = 'Especie Agrícola del Valle Mesotérmico de Sopachuy';
    primaryColor = '#15803d';
    elementSvg = `
      <g transform="translate(400, 350)">
        <path d="M0,0 Q-10,-120 0,-210" stroke="#15803d" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="-50" cy="-80" rx="45" ry="20" fill="#16a34a" transform="rotate(-35 -50 -80)"/>
        <ellipse cx="50" cy="-110" rx="45" ry="20" fill="#22c55e" transform="rotate(30 50 -110)"/>
        <ellipse cx="-40" cy="-160" rx="38" ry="18" fill="#15803d" transform="rotate(-25 -40 -160)"/>
        <ellipse cx="40" cy="-180" rx="38" ry="18" fill="#4ade80" transform="rotate(25 40 -180)"/>
        <circle cx="0" cy="-215" r="14" fill="#facc15" stroke="#eab308" stroke-width="3"/>
      </g>
    `;
  }

  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeBotanical = botanicalName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="45%" stop-color="#38bdf8"/>
        <stop offset="75%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#f0fdf4"/>
      </linearGradient>
      <linearGradient id="sunGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#64748b"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
      <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="valleyTerrace" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#65a30d"/>
        <stop offset="100%" stop-color="#3f6212"/>
      </linearGradient>
      <linearGradient id="richSoil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
    </defs>

    <rect width="800" height="600" fill="url(#skyGrad)"/>
    <circle cx="680" cy="110" r="55" fill="url(#sunGlow)" opacity="0.95"/>
    <circle cx="680" cy="110" r="75" fill="#fef9c3" opacity="0.3"/>

    <polygon points="-20,320 160,160 340,320" fill="url(#mountainFar)" opacity="0.75"/>
    <polygon points="240,320 440,140 640,320" fill="url(#mountainFar)" opacity="0.85"/>
    <polygon points="520,320 700,180 820,320" fill="url(#mountainFar)" opacity="0.7"/>

    <polygon points="40,340 220,220 400,340" fill="url(#mountainMid)" opacity="0.9"/>
    <polygon points="360,340 540,210 720,340" fill="url(#mountainMid)" opacity="0.9"/>

    <path d="M-10,330 Q180,290 380,320 T810,300 L810,600 L-10,600 Z" fill="url(#valleyTerrace)"/>
    <path d="M80,360 Q260,345 420,370 T810,350" stroke="#38bdf8" stroke-width="8" fill="none" opacity="0.7"/>
    <path d="M-10,430 Q220,395 440,420 T810,410 L810,600 L-10,600 Z" fill="url(#richSoil)"/>

    ${elementSvg}

    <g transform="translate(30, 475)">
      <rect width="740" height="95" rx="16" fill="#0f172a" fill-opacity="0.92" stroke="#334155" stroke-width="1.5"/>
      <rect x="20" y="16" width="165" height="24" rx="6" fill="${primaryColor}"/>
      <text x="102" y="32" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SOPACHUY · COTA 2,050M</text>
      <rect x="195" y="16" width="60" height="24" rx="6" fill="#334155"/>
      <text x="225" y="32" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${size}</text>
      <text x="20" y="62" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold">${safeTitle}</text>
      <text x="20" y="82" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="12">${safeBotanical}</text>
    </g>
  </svg>`;
}

app.post('/api/generate-image', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, size = '1K', aspectRatio = '4:3' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'El prompt de imagen es obligatorio.' });
      return;
    }

    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(size) ? size : '1K';
    const enrichedPrompt = `Fotografía agrícola realista en el valle de Sopachuy Chuquisaca: ${prompt}. Luz natural de valle andino, textura orgánica de alta definición, cultivo o planta saludable y enfoque botánico profesional.`;

    let base64Image = '';
    let mimeType = 'image/png';
    let isFallback = false;
    let modelName = 'gemini-nano-banana-2.1';

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-nano-banana-2.1',
          contents: {
            parts: [{ text: enrichedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: selectedSize as any,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            base64Image = part.inlineData.data;
            mimeType = part.inlineData.mimeType || 'image/png';
            break;
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini image model error (likely free-tier quota=0), using high-fidelity Sopachuy botanical visual:', geminiErr?.message);
      }
    }

    // If Gemini image model call didn't yield an image (e.g., 429 quota limit 0 on free tier)
    if (!base64Image) {
      const svg = generateAgriculturalIllustrationSvg(prompt, selectedSize);
      base64Image = Buffer.from(svg).toString('base64');
      mimeType = 'image/svg+xml';
      isFallback = true;
      modelName = 'Ilustración Botánica de Sopachuy (HD)';
    }

    res.json({
      imageBase64: base64Image,
      mimeType,
      size: selectedSize,
      isFallback,
      model: modelName,
      prompt,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    // Even in catch, provide botanical SVG so frontend never fails
    const prompt = (req.body && req.body.prompt) || 'Cultivo de Sopachuy';
    const svg = generateAgriculturalIllustrationSvg(prompt, '1K');
    res.json({
      imageBase64: Buffer.from(svg).toString('base64'),
      mimeType: 'image/svg+xml',
      size: '1K',
      isFallback: true,
      model: 'Ilustración Botánica Sopachuy',
      prompt,
    });
  }
});

/**
 * Microclimate Geolocation Endpoint with Google Maps Grounding (gemini-3.8-flash)
 */
app.post('/api/microclimate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, zoneId } = req.body;
    const { findNearestMicroclimateZone, SOPACHUY_MICROCLIMATE_ZONES, BIOSCIENCE_DATA } = await import('./src/utils/agricultural.ts');

    let targetZone = SOPACHUY_MICROCLIMATE_ZONES[0];
    let lat = -19.4892;
    let lng = -64.4785;

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      lat = latitude;
      lng = longitude;
      targetZone = findNearestMicroclimateZone(lat, lng);
    } else if (zoneId) {
      const found = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === zoneId);
      if (found) {
        targetZone = found;
        lat = found.lat;
        lng = found.lng;
      }
    }

    let aiAnalysis = '';
    const groundingLinks: { title: string; uri: string; type: 'maps' | 'web' }[] = [];

    if (apiKey) {
      try {
        const prompt = `Analiza la geografía y el microclima agrícola para un productor o estudiante rural en las coordenadas geográficas latitud ${lat}, longitud ${lng}, en la zona "${targetZone.name}" del municipio de Sopachuy (Provincia Tomina, Chuquisaca, Bolivia), a una cota de ${targetZone.elevation} msnm.
Detalla:
1. Características topográficas y geográficas del valle (pendientes, fuentes hídricas cercanas, ríos o quebradas, exposición solar).
2. Ajustes al calendario agrícola de siembra y cosecha para esta altitud (siembras tempranas mishka vs siembras grandes de secano).
3. Fundamentos bio-científicos botánicos (eficiencia fotosintética C3 vs C4 de los cultivos locales, requerimientos de pH y control biológico de Spodoptera frugiperda y Phytophthora infestans).
4. Tres consejos prácticos inmediatos para el agricultor en este microclima.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: lat,
                  longitude: lng,
                },
              },
            },
          },
        });

        aiAnalysis = response.text || '';

        // Extract Google Maps Grounding URLs
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        for (const chunk of chunks) {
          if ((chunk as any).maps?.uri) {
            groundingLinks.push({
              title: (chunk as any).maps.title || 'Ubicación en Google Maps',
              uri: (chunk as any).maps.uri,
              type: 'maps',
            });
          }
          if ((chunk as any).web?.uri) {
            groundingLinks.push({
              title: (chunk as any).web.title || 'Fuente web verificada',
              uri: (chunk as any).web.uri,
              type: 'web',
            });
          }
        }
      } catch (err: any) {
        console.warn('Google Maps Grounding warning, providing synthesized local analysis:', err?.message);
        aiAnalysis = `Ajuste para la zona de ${targetZone.name} (${targetZone.elevation} msnm): ${targetZone.sowingAdjustment}. ${targetZone.soilAdvisory}. ${targetZone.phytosanitaryAlert}`;
      }
    } else {
      aiAnalysis = `Ajuste para la zona de ${targetZone.name} (${targetZone.elevation} msnm): ${targetZone.sowingAdjustment}. ${targetZone.soilAdvisory}. ${targetZone.phytosanitaryAlert}`;
    }

    res.json({
      zone: targetZone,
      coordinates: { latitude: lat, longitude: lng },
      analysis: aiAnalysis,
      groundingLinks: groundingLinks,
      bioscience: BIOSCIENCE_DATA,
    });
  } catch (error: any) {
    console.error('Error in /api/microclimate:', error);
    res.status(500).json({ error: error?.message || 'Error analizando microclima.' });
  }
});

/**
 * Real-time Weather Grounding with Google Search (gemini-3.8-flash)
 */
app.post('/api/weather-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query = 'clima y precipitaciones actuales en Sopachuy Chuquisaca valle' } = req.body;

    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Proporciona un resumen agroclimático actualizado sobre el tiempo, temperaturas, régimen de lluvias y pronóstico para los valles agrícolas del municipio de Sopachuy y la provincia Tomina en Chuquisaca, Bolivia. Consulta: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchLinks: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    for (const chunk of chunks) {
      if ((chunk as any).web?.uri) {
        searchLinks.push({
          title: (chunk as any).web.title || 'Referencia de Google Search',
          uri: (chunk as any).web.uri,
        });
      }
    }

    res.json({
      report: response.text || 'Sin información meteorológica disponible.',
      sources: searchLinks,
    });
  } catch (error: any) {
    console.error('Error in /api/weather-search:', error);
    res.status(500).json({ error: error?.message || 'Error en búsqueda meteorológica.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Manual Digital Agrícola de Sopachuy iniciado en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
