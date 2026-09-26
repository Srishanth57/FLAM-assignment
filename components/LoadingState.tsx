"use client";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Scanning the shelves for something delicious…",
}: LoadingStateProps) {
  return (
    <p className="mt-5 flex items-center gap-2 text-sm text-muted">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
      {message}
    </p>
  );
}
