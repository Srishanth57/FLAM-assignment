"use server";

type RecipeData = {
  title: string;
  description?: string;
  steps: string[];
};

type ActionResult =
  | { success: true; data: RecipeData }
  | { success: false; error: string; code: ErrorCode };

type ErrorCode =
  | "MISSING_INPUT"
  | "CONFIG_ERROR"
  | "RATE_LIMIT"
  | "SAFETY_BLOCK"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "UNKNOWN";

import { GoogleGenAI } from "@google/genai";

export async function generateRecipeResult(
  ingredients: string,
): Promise<ActionResult> {
  if (!ingredients || !ingredients.trim()) {
    return {
      success: false,
      error: "Please list at least one ingredient.",
      code: "MISSING_INPUT",
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return {
      success: false,
      error: "Recipe service is temporarily unavailable.",
      code: "CONFIG_ERROR",
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Return ONLY valid JSON matching this shape, no prose:
  {
    "title": "Recipe Name",
    "description": "Short description",
    "steps": ["Step 1", "Step 2"]
  }
  Ingredients: ${ingredients}`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      return {
        success: false,
        error: "Too many requests — please try again in a moment.",
        code: "RATE_LIMIT",
      };
    }
    if (
      message.includes("fetch failed") ||
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT")
    ) {
      return {
        success: false,
        error: "Network error — check your connection and try again.",
        code: "NETWORK_ERROR",
      };
    }

    console.error("Gemini API call failed:", message);
    return {
      success: false,
      error: "Couldn't reach the recipe service. Please try again.",
      code: "UNKNOWN",
    };
  }

  console.log(response);
  const candidate = response.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") {
    return {
      success: false,
      error:
        "That request couldn't be processed. Try rephrasing your ingredients.",
      code: "SAFETY_BLOCK",
    };
  }

  const raw = response.text || "";
  if (!raw.trim()) {
    return {
      success: false,
      error: "No recipe was generated. Please try again.",
      code: "INVALID_RESPONSE",
    };
  }

  try {
    const cleanJson = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(cleanJson);

    if (!data.title || !Array.isArray(data.steps) || data.steps.length === 0) {
      console.error("Malformed recipe shape:", data);
      return {
        success: false,
        error: "Received an incomplete recipe. Please try again.",
        code: "INVALID_RESPONSE",
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("JSON parse failed. Raw output:", raw);
    return {
      success: false,
      error: "Received an unreadable recipe. Please try again.",
      code: "INVALID_RESPONSE",
    };
  }
}
