import { CheckCircle2, Clock, FlaskConical, Target } from "lucide-react";
import { CodeBlock } from "@/components/course-blocks";
import type { Lab } from "@/lib/course-oca-sql";
import { tr } from "@/lib/course-oca-sql";
import type { Locale } from "@/lib/i18n/locale";
import { dictionary } from "@/lib/i18n/dictionary";

/**
 * Travaux pratiques d'une session. Rendu côté serveur : rien d'interactif ici,
 * l'interaction se passe dans le terminal SQL de l'apprenant.
 */
export function SessionLabs({ labs, locale }: { labs: Lab[]; locale: Locale }) {
  if (labs.length === 0) return null;
  const t = dictionary[locale];

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <FlaskConical className="h-5 w-5 text-primary" />
        {t.curriculum.labsTitle}
      </h2>
      <p className="text-pretty mt-1 text-sm text-muted-foreground">{t.curriculum.labsDesc}</p>

      <ol className="mt-5 space-y-5">
        {labs.map((lab, index) => (
          <li key={index} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="flex items-baseline gap-2.5 font-bold">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  {index + 1}
                </span>
                {tr(lab.title, locale)}
              </h3>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lab.minutes} {t.curriculum.labMinutes}
              </span>
            </div>

            <p className="mt-3 flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium text-foreground">{t.curriculum.labObjective} : </span>
                {tr(lab.objective, locale)}
              </span>
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.curriculum.labSteps}
            </p>
            <ol className="mt-2 space-y-1.5">
              {lab.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground">{stepIndex + 1}.</span>
                  <span>{tr(step, locale)}</span>
                </li>
              ))}
            </ol>

            {lab.code && (
              <div className="mt-4">
                <CodeBlock code={lab.code} />
              </div>
            )}

            <div className="mt-4 flex gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm leading-relaxed">
                <span className="font-medium">{t.curriculum.labExpected} : </span>
                <span className="text-muted-foreground">{tr(lab.expected, locale)}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
