/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Manual Digital Agrícola de Sopachuy - Serverless API (Vercel / Express)
 */

import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

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
 * Diagnostic Health Route
 */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

/**
 * Multi-turn Gemini Chat Endpoint
 */
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, modelChoice = 'gemini-3.1-flash-lite' } = req.body;

    if (!apiKey) {
      res.status(500).json({ error: 'La clave GEMINI_API_KEY no está configurada en las variables de entorno.' });
      return;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Debe proporcionar un historial de mensajes válido.' });
      return;
    }

    let selectedModel = 'gemini-3.1-flash-lite';
    if (modelChoice === 'gemini-4-argon') {
      selectedModel = 'gemini-4-argon';
    } else if (modelChoice === 'gemini-3.8-flash') {
      selectedModel = 'gemini-3.8-flash';
    } else if (modelChoice === 'gemini-3.1-flash' || modelChoice === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

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
 */
function generateAgriculturalIllustrationSvg(prompt: string, size: string): string {
  const isMaiz = /ma[ií]z/i.test(prompt);
  const isPapa = /papa/i.test(prompt);
  const isTrigo = /trigo/i.test(prompt);
  const isPest = /gusano|plaga|tiz[oó]n|polilla|pulg[oó]n|hongo|insect/i.test(prompt);
  const isDurazno = /durazn|frutal/i.test(prompt);

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
        <ellipse cx="-55" cy="45" rx="38" ry="26" fill="#78350f" stroke="#5c2605" stroke-width="3" transform="rotate(-10 -55 45)"/>
        <ellipse cx="45" cy="55" rx="44" ry="28" fill="#854d0e" stroke="#5c2605" stroke-width="3" transform="rotate(15 45 55)"/>
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
        <g transform="translate(25, -140) rotate(20)">
          <ellipse cx="0" cy="0" rx="22" ry="50" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        </g>
      </g>
    `;
  } else if (isPest) {
    botanicalName = 'Diagnóstico Fitosanitario y Control Agroecológico';
    primaryColor = '#b91c1c';
    elementSvg = `
      <g transform="translate(400, 290)">
        <path d="M-150,50 Q-60,-120 120,-90 Q150,60 -150,50 Z" fill="#4ade80" stroke="#16a34a" stroke-width="3"/>
        <circle cx="-20" cy="-10" r="22" fill="#78350f" opacity="0.8"/>
        <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">!</text>
      </g>
    `;
  } else {
    botanicalName = 'Especie Agrícola del Valle Mesotérmico de Sopachuy';
    primaryColor = '#15803d';
    elementSvg = `
      <g transform="translate(400, 350)">
        <path d="M0,0 Q-10,-120 0,-210" stroke="#15803d" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="-50" cy="-80" rx="45" ry="20" fill="#16a34a" transform="rotate(-35 -50 -80)"/>
        <circle cx="0" cy="-215" r="14" fill="#facc15" stroke="#eab308" stroke-width="3"/>
      </g>
    `;
  }

  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeBotanical = botanicalName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <rect width="800" height="600" fill="#38bdf8"/>
    ${elementSvg}
    <g transform="translate(30, 475)">
      <rect width="740" height="95" rx="16" fill="#0f172a" fill-opacity="0.92"/>
      <text x="20" y="62" fill="#ffffff" font-size="16" font-weight="bold">${safeTitle}</text>
      <text x="20" y="82" fill="#94a3b8" font-size="12">${safeBotanical}</text>
    </g>
  </svg>`;
}

app.post('/api/generate-image', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, size = '1K', aspectRatio = '4:3' } = req.body;
    const selectedSize = ['1K', '2K', '4K'].includes(size) ? size : '1K';
    const enrichedPrompt = `Fotografía agrícola realista en el valle de Sopachuy Chuquisaca: ${prompt}.`;

    let base64Image = '';
    let mimeType = 'image/png';
    let isFallback = false;
    let modelName = 'gemini-nano-banana-2.1';

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-nano-banana-2.1',
          contents: { parts: [{ text: enrichedPrompt }] },
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
        console.warn('Gemini image model fallback:', geminiErr?.message);
      }
    }

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
 * Microclimate Geolocation Endpoint with Google Maps Grounding
 */
const SOPACHUY_ZONES = [
  {
    id: "sopachuy-centro",
    name: "Sopachuy Centro (Valle Fértil)",
    elevation: 2050,
    lat: -19.4892,
    lng: -64.4785,
    climateType: "Valle mesotérmico templado subhúmedo",
    frostRisk: "Moderado",
    topCrops: ["Papa Imilla", "Maíz Choclero", "Durazno", "Cebolla", "Tomate"],
    sowingAdjustment: "Calendario estándar: siembra temprana (mishka) en septiembre y siembra principal en octubre.",
    soilAdvisory: "Suelos aluviales con buena retención hídrica. Aportar materia orgánica compostada.",
    phytosanitaryAlert: "Vigilar tizón tardío en veranos húmedos."
  }
];

app.post('/api/microclimate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, zoneId } = req.body;
    let targetZone = SOPACHUY_ZONES[0];
    let lat = -19.4892;
    let lng = -64.4785;

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      lat = latitude;
      lng = longitude;
    } else if (zoneId) {
      const found = SOPACHUY_ZONES.find((z) => z.id === zoneId);
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
        const prompt = `Analiza el microclima agrícola para latitud ${lat}, longitud ${lng}, en "${targetZone.name}", Sopachuy, Chuquisaca, Bolivia (${targetZone.elevation} msnm).`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude: lat, longitude: lng },
              },
            },
          },
        });
        aiAnalysis = response.text || '';
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        for (const chunk of chunks) {
          if ((chunk as any).maps?.uri) {
            groundingLinks.push({
              title: (chunk as any).maps.title || 'Google Maps',
              uri: (chunk as any).maps.uri,
              type: 'maps',
            });
          }
        }
      } catch (err: any) {
        aiAnalysis = `Ajuste para ${targetZone.name}: ${targetZone.sowingAdjustment}. ${targetZone.soilAdvisory}`;
      }
    } else {
      aiAnalysis = `Ajuste para ${targetZone.name}: ${targetZone.sowingAdjustment}. ${targetZone.soilAdvisory}`;
    }

    res.json({
      zone: targetZone,
      coordinates: { latitude: lat, longitude: lng },
      analysis: aiAnalysis,
      groundingLinks,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error analizando microclima.' });
  }
});

/**
 * Real-time Weather Grounding with Google Search
 */
app.post('/api/weather-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query = 'clima y precipitaciones en Sopachuy Chuquisaca' } = req.body;

    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Proporciona resumen agroclimático de Sopachuy y provincia Tomina: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchLinks: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    for (const chunk of chunks) {
      if ((chunk as any).web?.uri) {
        searchLinks.push({
          title: (chunk as any).web.title || 'Google Search',
          uri: (chunk as any).web.uri,
        });
      }
    }

    res.json({
      report: response.text || 'Sin información meteorológica.',
      sources: searchLinks,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error en búsqueda meteorológica.' });
  }
});

export default app;
