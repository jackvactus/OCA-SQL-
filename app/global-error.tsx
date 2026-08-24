"use client";

/**
 * Dernier filet : capture les erreurs survenues dans le gabarit racine
 * lui-même, là où `app/error.tsx` n'est plus monté. Doit rendre ses propres
 * balises <html> et <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: "34rem",
            padding: "2rem",
            borderRadius: "1rem",
            background: "#fff",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Erreur critique</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            L’application n’a pas pu démarrer.
          </p>
          <pre
            style={{
              textAlign: "left",
              fontSize: "0.75rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              overflow: "auto",
              maxHeight: "10rem",
              color: "#475569",
            }}
          >
            {error.message}
            {error.digest ? `\n\nRéférence : ${error.digest}` : ""}
          </pre>
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#0ea5e9",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
