"use server";

import { GoogleGenAI } from "@google/genai";
import { ActionResult } from "@/types/result";
import { validateResult } from "@/lib/validateResult";

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

  const prompt = `You are a recipe generator. First, check whether the input below consists of real, edible food ingredients.

If ANY item is not an edible food ingredient (e.g. "pen", "car", "rock", gibberish, or anything non-food), respond with ONLY this JSON shape, no prose:
{ "valid": false, "reason": "A short, specific explanation of which item(s) aren't food and why" }

If ALL items are genuine edible ingredients, respond with ONLY this JSON shape, no prose:
{ "valid": true, "title": "Recipe Name", "description": "Short description", "steps": ["Step 1", "Step 2"] }

Do not be lenient — a single non-food item makes the whole input invalid. Do not attempt to creatively reinterpret a non-food item as edible.

Input: ${ingredients}`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
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

  return validateResult(raw);
}
