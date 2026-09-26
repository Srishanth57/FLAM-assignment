export type RecipeData = {
  title: string;
  description?: string;
  steps: string[];
};

export type ErrorCode =
  | "MISSING_INPUT"
  | "INVALID_INGREDIENTS"
  | "CONFIG_ERROR"
  | "RATE_LIMIT"
  | "SAFETY_BLOCK"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "UNKNOWN";

export type ActionResult =
  | { success: true; data: RecipeData }
  | { success: false; error: string; code: ErrorCode };