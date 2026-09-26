"use client";

import type { RecipeData } from "@/types/result";
import RecipeCard from "./RecipeCard";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

interface ResultViewProps {
  isLoading: boolean;
  error: string | null;
  recipe: RecipeData | null;
  onRetry?: () => void;
}

export default function ResultView({
  isLoading,
  error,
  recipe,
  onRetry,
}: ResultViewProps) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (recipe) {
    return <RecipeCard recipe={recipe} />;
  }
  return null;
}
