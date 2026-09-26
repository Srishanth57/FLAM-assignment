"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateRecipeResult(ingredients: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Return ONLY valid JSON matching this shape, no prose:
    {
      "title": "Recipe Name",
      "description": "Short description",
      "steps": ["Step 1", "Step 2"]
    }
    Ingredients: ${ingredients}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const raw = response.text || "";
    const cleanJson = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(cleanJson);

    if (!data.title || !Array.isArray(data.steps)) {
      throw new Error("Invalid output shape");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "Failed to parse recipe. Please try again.",
    };
  }
}
