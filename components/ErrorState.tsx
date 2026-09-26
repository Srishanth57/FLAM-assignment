"use client";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-8 rise rounded-2xl border border-terracotta bg-cream p-6 text-center shadow-sm">
      <p className="font-medium text-terracotta-dark">{error}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-terracotta px-4 py-1.5 text-sm font-semibold text-terracotta-dark transition hover:bg-terracotta hover:text-cream"
        >
          Try again
        </button>
      )}
    </div>
  );
}