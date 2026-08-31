import Image from "next/image";
import { AlertTriangle, Check, Lightbulb, X } from "lucide-react";
import type { CourseBlock } from "@/lib/course-oca-sql";
import { tr } from "@/lib/course-oca-sql";
import type { Locale } from "@/lib/i18n/locale";

/** Coloration syntaxique SQL minimale, sans dépendance externe. */
const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "INNER JOIN", "LEFT JOIN",
  "RIGHT JOIN", "FULL JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN",
  "NATURAL JOIN", "JOIN", "ON", "USING", "UNION ALL", "UNION", "INTERSECT", "MINUS",
  "INSERT INTO", "INSERT", "UPDATE", "DELETE", "MERGE INTO", "MERGE", "VALUES", "SET",
  "CREATE OR REPLACE", "CREATE", "ALTER", "DROP", "TRUNCATE", "RENAME", "TABLE", "VIEW",
  "INDEX", "SEQUENCE", "USER", "ROLE", "CONSTRAINT", "PRIMARY KEY", "FOREIGN KEY",
  "REFERENCES", "UNIQUE", "NOT NULL", "CHECK", "DEFAULT", "GRANT", "REVOKE", "COMMIT",
  "ROLLBACK", "SAVEPOINT", "WITH", "AS", "AND", "OR", "NOT", "IN", "EXISTS", "BETWEEN",
  "LIKE", "IS NULL", "IS NOT NULL", "NULL", "DISTINCT", "ASC", "DESC", "CASE", "WHEN",
  "THEN", "ELSE", "END", "OVER", "PARTITION BY", "ROWS", "BETWEEN", "PRECEDING",
  "CURRENT ROW", "UNBOUNDED", "FETCH", "FIRST", "NEXT", "ONLY", "OFFSET", "WHEN MATCHED",
  "WHEN NOT MATCHED", "CASCADE", "IDENTIFIED BY", "INTERVAL", "TIMESTAMP", "AT TIME ZONE",
  "START WITH", "INCREMENT BY", "MINVALUE", "MAXVALUE", "CACHE", "NOCYCLE", "PURGE",
  "SET UNUSED", "DROP UNUSED COLUMNS", "WITH CHECK OPTION", "WITH READ ONLY", "WITH GRANT OPTION",
];
const KEYWORD_RE = new RegExp(`\\b(${KEYWORDS.map((k) => k.replace(/ /g, "\\s+")).join("|")})\\b`, "gi");

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  code.split("\n").forEach((line, lineIndex) => {
    const commentAt = line.indexOf("--");
    const sql = commentAt >= 0 ? line.slice(0, commentAt) : line;
    const comment = commentAt >= 0 ? line.slice(commentAt) : "";

    const parts: React.ReactNode[] = [];
    let cursor = 0;
    // chaînes littérales d'abord
    const stringRe = /'[^']*'|"[^"]*"/g;
    const segments: { start: number; end: number; text: string }[] = [];
    let sm: RegExpExecArray | null;
    while ((sm = stringRe.exec(sql)) !== null) {
      segments.push({ start: sm.index, end: sm.index + sm[0].length, text: sm[0] });
    }
    const pushKeyworded = (text: string, keyBase: string) => {
      let last = 0;
      let km: RegExpExecArray | null;
      const re = new RegExp(KEYWORD_RE.source, "gi");
      while ((km = re.exec(text)) !== null) {
        if (km.index > last) parts.push(text.slice(last, km.index));
        parts.push(
          <span key={`${keyBase}-k${km.index}`} className="font-semibold text-rose-400">
            {km[0]}
          </span>,
        );
        last = km.index + km[0].length;
      }
      if (last < text.length) parts.push(text.slice(last));
    };

    segments.forEach((seg, i) => {
      if (seg.start > cursor) pushKeyworded(sql.slice(cursor, seg.start), `l${lineIndex}s${i}`);
      parts.push(
        <span key={`l${lineIndex}str${i}`} className="text-emerald-400">
          {seg.text}
        </span>,
      );
      cursor = seg.end;
    });
    if (cursor < sql.length) pushKeyworded(sql.slice(cursor), `l${lineIndex}tail`);
    if (comment) {
      parts.push(
        <span key={`l${lineIndex}c`} className="text-slate-500 italic">
          {comment}
        </span>,
      );
    }

    out.push(
      <span key={`line-${lineIndex}`} className="block">
        {parts.length ? parts : " "}
      </span>,
    );
  });
  return out;
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <pre
      className={`overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1622] p-4 text-[13px] leading-relaxed text-slate-200 shadow-sm ${className ?? ""}`}
    >
      <code className="font-mono">{highlight(code)}</code>
    </pre>
  );
}

export function CourseBlockView({ block, locale }: { block: CourseBlock; locale: Locale }) {
  switch (block.kind) {
    case "text":
      return <p className="leading-relaxed text-muted-foreground">{tr(block.body, locale)}</p>;

    case "list":
      return (
        <div>
          {block.title && <h4 className="mb-2 font-semibold">{tr(block.title, locale)}</h4>}
          <ul className="space-y-1.5">
            {block.items.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{tr(item, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "code":
      return (
        <figure className="space-y-2">
          {block.title && (
            <figcaption className="text-sm font-semibold">{tr(block.title, locale)}</figcaption>
          )}
          <CodeBlock code={block.code} />
          {block.caption && (
            <figcaption className="text-xs leading-relaxed text-muted-foreground">
              {tr(block.caption, locale)}
            </figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <div className="space-y-2">
          {block.title && <h4 className="font-semibold">{tr(block.title, locale)}</h4>}
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[32rem] text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {block.headers.map((header, index) => (
                    <th key={index} className="px-4 py-2.5 text-left font-semibold">
                      {tr(header, locale)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="align-top">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-2.5 ${cellIndex === 0 ? "font-mono text-[13px] font-medium" : "text-muted-foreground"}`}
                      >
                        {tr(cell, locale)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "tip":
      return (
        <aside className="flex gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            {block.title && <p className="font-semibold">{tr(block.title, locale)}</p>}
            <p className="text-sm leading-relaxed text-muted-foreground">{tr(block.body, locale)}</p>
          </div>
        </aside>
      );

    case "warning":
      return (
        <aside className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            {block.title && <p className="font-semibold">{tr(block.title, locale)}</p>}
            <p className="text-sm leading-relaxed text-muted-foreground">{tr(block.body, locale)}</p>
          </div>
        </aside>
      );

    case "compare":
      return (
        <div className="space-y-2">
          {block.title && <h4 className="font-semibold">{tr(block.title, locale)}</h4>}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
                <X className="h-3.5 w-3.5" />
                {locale === "en" ? "Incorrect" : "Incorrect"}
              </p>
              <CodeBlock code={block.wrong} className="border-rose-500/30" />
            </div>
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                {locale === "en" ? "Correct" : "Correct"}
              </p>
              <CodeBlock code={block.right} className="border-emerald-500/30" />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{tr(block.note, locale)}</p>
        </div>
      );

    case "figure":
      return (
        <figure className="space-y-2">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-[#04121c]">
            <Image
              src={block.src}
              alt={tr(block.alt, locale)}
              width={block.width}
              height={block.height}
              sizes="(max-width: 768px) 100vw, 44rem"
              className="h-auto w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs leading-relaxed text-muted-foreground">
              {tr(block.caption, locale)}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
