"use client";

import { useState } from "react";
import { Check, CircleCheckBig, Eye, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/use-progress";
import { useLanguage } from "@/components/language-provider";
import { tr, type Bilingual, type SelfCheck } from "@/lib/course-oca-sql";
import { cn } from "@/lib/utils";

/** Une question de contrôle : la réponse ne se dévoile qu'au clic. */
function SelfCheckItem({ item, index }: { item: SelfCheck; index: number }) {
  const { locale, t } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  return (
    <li className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-relaxed">{tr(item.question, locale)}</p>

          {revealed ? (
            <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground animate-fade-in">
              {tr(item.answer, locale)}
            </p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRevealed(true)}
              className="mt-2 h-7 gap-1.5 px-2 text-xs text-primary hover:text-primary"
            >
              <Eye className="h-3.5 w-3.5" />
              {t.curriculum.revealAnswer}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export function SessionReview({
  sessionId,
  keyTakeaways,
  selfCheck,
}: {
  sessionId: string;
  keyTakeaways?: Bilingual[];
  selfCheck?: SelfCheck[];
}) {
  const { locale, t } = useLanguage();
  const { progress, loaded, completeLesson } = useProgress();
  const done = progress.completedLessons.includes(sessionId);

  return (
    <div className="mt-12 space-y-6">
      {keyTakeaways && keyTakeaways.length > 0 && (
        <Card className="border-primary/25 bg-primary/[0.04]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              {t.curriculum.takeaways}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {keyTakeaways.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{tr(item, locale)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {selfCheck && selfCheck.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <HelpCircle className="h-5 w-5 text-primary" />
            {t.curriculum.selfCheckTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.curriculum.selfCheckDesc}</p>
          <ul className="mt-4 space-y-3">
            {selfCheck.map((item, index) => (
              <SelfCheckItem key={index} item={item} index={index} />
            ))}
          </ul>
        </section>
      )}

      {/* Validation de la session */}
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          done ? "border-emerald-500/40 bg-emerald-500/[0.06]" : "border-border/70 bg-muted/30",
        )}
      >
        <div className="flex items-start gap-3">
          <CircleCheckBig
            className={cn("mt-0.5 h-5 w-5 shrink-0", done ? "text-emerald-500" : "text-muted-foreground")}
          />
          <div>
            <p className="font-medium">
              {done ? t.curriculum.sessionDone : t.curriculum.markDoneTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {done ? t.curriculum.sessionDoneDesc : t.curriculum.markDoneDesc}
            </p>
          </div>
        </div>
        {loaded && !done && (
          <Button onClick={() => completeLesson(sessionId)} className="shrink-0 gap-2">
            <Check className="h-4 w-4" />
            {t.curriculum.markDone}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Barre de progression d'un cursus, calculée sur les sessions terminées. */
export function CurriculumProgress({ sessionIds }: { sessionIds: string[] }) {
  const { t } = useLanguage();
  const { progress, loaded } = useProgress();
  if (!loaded) return null;

  const done = sessionIds.filter((id) => progress.completedLessons.includes(id)).length;
  const percent = sessionIds.length === 0 ? 0 : Math.round((done / sessionIds.length) * 100);

  return (
    <div className="min-w-[9rem]">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{t.curriculum.progressLabel}</span>
        <span className="font-semibold tabular-nums">
          {done}/{sessionIds.length}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** Pastille « terminé » sur la carte d'une session. */
export function SessionDoneBadge({ sessionId }: { sessionId: string }) {
  const { progress, loaded } = useProgress();
  if (!loaded || !progress.completedLessons.includes(sessionId)) return null;
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      title="OK"
    >
      <Check className="h-3 w-3" />
    </span>
  );
}
