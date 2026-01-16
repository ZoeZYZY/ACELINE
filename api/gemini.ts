
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function handleMysticAnalysis(req: Request) {
  const { content } = await req.json();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As an expert tennis coach, analyze this match data and provide insights: ${content}`,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  return new Response(JSON.stringify({ analysis: response.text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleMysticTitle(req: Request) {
  const { content } = await req.json();
  
  // Fix: Use gemini-3-flash-preview instead of gemini-3-flash-latest
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a catchy tennis album title for this: ${content}`,
  });

  return new Response(JSON.stringify({ title: response.text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
