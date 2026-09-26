"use client";

interface RecipeData {
  title: string;
  description: string;
  steps: string[];
}

interface RecipeResultProps {
  recipe: RecipeData | null;
  error: string | null;
}

export default function RecipeResult({ recipe, error }: RecipeResultProps) {
  if (error) {
    return (
      <div className="mt-8 rounded-2xl border border-terracotta bg-cream p-6 text-center text-terracotta-dark shadow-sm">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="mt-8 rise rounded-[2rem] border border-line bg-cream p-6 shadow-[0_10px_40px_-20px_rgba(28,23,18,0.2)] sm:p-8">
      <header className="border-b border-line/80 pb-5">
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          {recipe.title}
        </h2>
        <p className="mt-3 text-lg text-muted">{recipe.description}</p>
      </header>
      
      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Instructions
        </h3>
        <ol className="mt-5 flex flex-col gap-4">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="mt-0.5 font-display text-lg text-terracotta">
                {idx + 1}
              </span>
              <span className="text-base leading-relaxed text-ink">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}