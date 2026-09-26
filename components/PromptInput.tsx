"use client";

import { useState } from "react";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SUGGESTIONS = [
  "eggs",
  "leftover rice",
  "spinach",
  "cheddar",
  "chicken thighs",
  "tomatoes",
  "garlic",
  "lemon",
];

export default function PromptInput({
  onSubmit,
  isLoading,
  placeholder = "eggs, spinach, leftover rice, a knob of butter…",
}: PromptInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  }

  function addSuggestion(item: string) {
    setText((current) => {
      const trimmed = current.trim();
      if (!trimmed) return item;
      if (trimmed.toLowerCase().includes(item.toLowerCase())) return current;
      return `${trimmed}, ${item}`;
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor="ingredients" className="text-sm font-medium text-sage">
          What’s in the fridge?
        </label>
        <span className="text-xs text-muted">Comma-separated is perfect</span>
      </div>

      <div className="relative rounded-2xl border border-line bg-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <textarea
          id="ingredients"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          rows={4}
          className="w-full resize-none bg-transparent px-4 py-4 font-sans text-base leading-relaxed text-ink outline-none placeholder:text-muted/70 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => addSuggestion(item)}
            disabled={isLoading}
            className="rounded-full border border-line bg-paper/70 px-3 py-1.5 text-xs text-ink transition hover:border-sage hover:bg-sage-mist disabled:opacity-50"
          >
            + {item}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracotta px-6 text-sm font-semibold text-cream shadow-[0_10px_24px_-12px_rgba(194,77,44,0.9)] transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
            Opening the fridge…
          </>
        ) : (
          <>
            Cook something up
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
