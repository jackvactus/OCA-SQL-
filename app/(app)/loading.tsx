export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-8" aria-busy="true" aria-live="polite">
      <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
