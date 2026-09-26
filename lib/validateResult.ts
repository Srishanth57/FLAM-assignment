import { ActionResult } from "@/types/result";

export function validateResult(raw: string): ActionResult {
  const cleanJson = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let data: any;
  try {
    data = JSON.parse(cleanJson);
  } catch {
    console.error("JSON parse failed. Raw output:", raw);
    return {
      success: false,
      error: "Received an unreadable recipe. Please try again.",
      code: "INVALID_RESPONSE",
    };
  }
  if (data.valid === false) {
    return {
      success: false,
      error:
        data.reason ||
        "Those don't look like edible ingredients. Please list actual food items.",
      code: "INVALID_INGREDIENTS",
    };
  }

  if (
    !data.valid ||
    !data.title ||
    !Array.isArray(data.steps) ||
    data.steps.length === 0
  ) {
    console.error("Malformed recipe shape:", data);
    return {
      success: false,
      error: "Received an incomplete recipe. Please try again.",
      code: "INVALID_RESPONSE",
    };
  }

  return {
    success: true,
    data: {
      title: data.title,
      description: data.description,
      steps: data.steps,
    },
  };
}
