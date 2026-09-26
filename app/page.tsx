"use client";

import { useRef, useState } from "react";
import PromptInput from "@/components/PromptInput";
import { generateRecipeResult } from "@/server/actions";
import RecipeResult from "@/components/RecipeCard";
import type { RecipeData } from "@/types/result";

function parseIngredients(raw: string) {
  return raw
    .split(/,|\n|\band\b/i)
    .map((part) => part.replace(/^and\s+/i, "").trim())
    .filter(Boolean);
}

function FridgeMark() {
  return (
    <svg viewBox="0 0 48 64" className="h-10 w-8" aria-hidden fill="none">
      <rect x="8" y="4" width="32" height="56" rx="6" fill="#2c4636" />
      <rect x="12" y="8" width="24" height="22" rx="3" fill="#fff8ee" />
      <rect x="12" y="34" width="24" height="20" rx="3" fill="#efe4cf" />
      <rect x="32" y="16" width="2.5" height="8" rx="1" fill="#c24d2c" />
      <rect x="32" y="40" width="2.5" height="8" rx="1" fill="#c24d2c" />
    </svg>
  );
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string | null>(null);

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  async function handleSubmit(text: string) {
    setIsLoading(true);
    setIngredients(text);
    setError(null);

    const currentId = ++requestId.current;

    const result = await generateRecipeResult(text);
    if (currentId !== requestId.current) return;

    setIsLoading(false);

    if (result.success) {
      setRecipe(result.data);
    } else {
      setRecipe(null);
      setError(result.error || "Something went wrong.");
    }
  }

  const chips = ingredients ? parseIngredients(ingredients) : [];

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="grain" />
      <div className="orb -left-24 -top-16 h-72 w-72 bg-gold/50" />
      <div className="orb -right-16 top-40 h-80 w-80 bg-sage-mist/80" />
      <div className="orb bottom-0 left-1/3 h-56 w-56 bg-terracotta/20" />

      <div className="relative z-10 mx-auto flex min-h-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FridgeMark />
            <div>
              <p className="font-display text-xl leading-none tracking-tight">
                Pantry
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                Fridge → recipe
              </p>
            </div>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            No meal plan required.
          </p>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 sm:grid-cols-[1fr_1fr] sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <section className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-terracotta">
              Tonight, from what’s already there
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
              Open the fridge.
              <span className="block text-sage">We’ll find dinner.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Dump in the odds and ends on your shelves. Pantry turns them into
              a recipe idea — no grocery run, no guilt about the leftover rice.
            </p>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-sage">
              <li>Uses what you have</li>
              <li
                aria-hidden
                className="hidden h-1 w-1 rounded-full bg-gold sm:block"
              />
              <li>Ready in minutes</li>
              <li
                aria-hidden
                className="hidden h-1 w-1 rounded-full bg-gold sm:block"
              />
              <li>Zero fancy equipment</li>
            </ul>
          </section>

          <section className="rise rounded-[2rem] border border-line bg-cream/80 p-5 pb-7 shadow-[0_30px_60px_-36px_rgba(28,23,18,0.45)] backdrop-blur-sm sm:p-8">
            <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

            {isLoading && (
              <p className="mt-5 text-sm text-muted">
                Scanning the shelves for something delicious…
              </p>
            )}

            {!isLoading && chips.length > 0 && (
              <div className="mt-6 border-t border-line pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  On the shelf
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-sage px-3 py-1.5 text-sm text-cream"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(recipe || error) && (
              <RecipeResult recipe={recipe} error={error} />
            )}
          </section>
        </main>

        <footer className="flex items-center justify-between gap-4 border-t border-line/80 py-5 text-xs text-muted">
          <span>Made for hungry people with a half-full fridge.</span>
          <span className="hidden sm:inline">Pantry · 2026</span>
        </footer>
      </div>
    </div>
  );
}
