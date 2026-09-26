# Pantry — Fridge to Recipe

Turn whatever's sitting in your fridge into a dinner idea. Type in your ingredients, and Gemini turns them into a recipe with a title, description, and step-by-step instructions.

Built for the Flam frontend assignment.
## Demo


https://github.com/user-attachments/assets/4c14cd10-e841-4bd6-9358-b3e4e2592a0b




## Setup

```bash
git clone https://github.com/Srishanth57/FLAM-assignment.git
cd flam-assignment
npm install
```

Copy `.env.example` to `.env.local` and add a Gemini API key (free tier works — get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)):

```bash
cp .env.example .env.local
```

GEMINI_API_KEY=your_key_here

Run it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. List what's in your fridge in the text box — comma-separated works best (e.g. `eggs, spinach, leftover rice, a knob of butter`), or tap a suggestion chip to add one.
2. Hit **Cook something up**.
3. The app sends your ingredients to a Server Action (`server/actions.ts`), which prompts Gemini for a strict JSON shape, validates the response, and renders either a recipe card or a specific error message — never a blank screen or a crash.

If you enter something that isn't food (e.g. "pen, car"), the model is instructed to recognize that and return a `reason` explaining why, instead of hallucinating a recipe out of it.

## AI usage note

This project was built with Claude (Anthropic) as a pair-programming assistant throughout — for scaffolding components, designing the page layout, JSON shape, writing the Gemini prompt and its "reject non-food input" validation logic, structuring error handling into distinct codes (`RATE_LIMIT`, `SAFETY_BLOCK`, `INVALID_INGREDIENTS`, etc.). I directed each step, reviewed and understood every change before committing it, and can walk through and modify any part of the code live.

## Known limitations

- **Ingredient validation is prompt-based, not deterministic.** The model is instructed to reject non-food input, but it's still a judgment call by an LLM — an ambiguous item (e.g. "gummy bear") could occasionally be misclassified in either direction.
- **No streaming yet.** The recipe appears all at once after the full response returns, rather than word-by-word.
- **No persistence.** Refreshing the page loses the current recipe; there's no save/reload of past sessions.
- **Recipes aren't scalable by servings yet**, and there's no ingredient-swap UI — the current JSON shape (`title`, `description`, `steps`) doesn't yet carry structured ingredient data (amounts, units) needed for that.
- **No dark mode toggle** is wired up yet, though the design uses CSS custom properties, so it's a lightweight addition.

## Time spent

~[4-5] hours.

If I had more time, I'd prioritize: the scalable-servings/ingredient-swap feature (the app's actual differentiator per the "fridge-to-recipe" idea), then streaming, then dark mode.
