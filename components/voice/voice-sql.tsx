"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, CornerDownLeft, Loader2, Mic, MicOff, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { useSpeechRecognition, type ErreurVocale } from "@/hooks/use-speech-recognition";
import { voiceToSql, type VoiceSqlResult } from "@/lib/voice-sql";

/**
 * Commande vocale du bac à sable : parler, transcrire, traduire, exécuter.
 *
 * La traduction est déterministe et locale (`lib/voice-sql`). Ce composant ne
 * fait que l'orchestration et, surtout, **montre l'intermédiaire** : la phrase
 * entendue et la requête produite sont affichées avant toute exécution. Sur
 * une plateforme d'apprentissage, voir la traduction est la moitié de
 * l'intérêt — c'est ainsi qu'on apprend à écrire la requête soi-même.
 */

const ERREURS: Record<ErreurVocale, { fr: string; en: string }> = {
  refuse: {
    fr: "Micro refusé. Autorisez-le dans les réglages du site, puis réessayez.",
    en: "Microphone denied. Allow it in the site settings, then try again.",
  },
  silence: {
    fr: "Rien n'a été entendu. Parlez après le signal, plus près du micro.",
    en: "Nothing was heard. Speak after the signal, closer to the microphone.",
  },
  reseau: {
    fr: "La transcription passe par un service en ligne, actuellement injoignable. Tapez votre phrase.",
    en: "Transcription goes through an online service, currently unreachable. Type your sentence instead.",
  },
  indisponible: {
    fr: "Ce navigateur ne sait pas transcrire la parole. Chrome, Edge et Safari le font ; Firefox non.",
    en: "This browser cannot transcribe speech. Chrome, Edge and Safari can; Firefox cannot.",
  },
  autre: { fr: "La dictée s'est interrompue.", en: "Dictation stopped." },
};

const EXEMPLES = {
  fr: [
    "les employés dont le salaire dépasse 5000",
    "combien d'employés par département",
    "select étoile from employés",
  ],
  en: [
    "employees whose salary is over 5000",
    "how many employees per department",
    "select star from employees",
  ],
};

export function VoiceSql({
  onQuery,
  className,
}: {
  /** Reçoit la requête traduite, pour la charger dans l'éditeur et l'exécuter. */
  onQuery: (sql: string) => void;
  className?: string;
}) {
  const { locale } = useLanguage();
  const en = locale === "en";
  const [resultat, setResultat] = useState<VoiceSqlResult | null>(null);
  const [saisie, setSaisie] = useState("");
  const [saisieOuverte, setSaisieOuverte] = useState(false);

  const traduire = useCallback(
    (phrase: string) => {
      const traduction = voiceToSql(phrase, locale);
      setResultat(traduction);
      // Exécution immédiate quand la requête tourne : le bac à sable est en
      // lecture seule, l'aller-retour n'a aucun risque et la boucle
      // parler → voir le résultat est ce qui fait apprendre.
      if (traduction.sql && traduction.valide) onQuery(traduction.sql);
    },
    [locale, onQuery],
  );

  const { supporte, ecoute, provisoire, erreur, demarrer, arreter } = useSpeechRecognition(
    locale,
    traduire,
  );

  const soumettreSaisie = () => {
    const phrase = saisie.trim();
    if (!phrase) return;
    traduire(phrase);
    setSaisie("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {supporte ? (
          <Button
            type="button"
            size="sm"
            variant={ecoute ? "destructive" : "outline"}
            onClick={ecoute ? arreter : demarrer}
            className="gap-1.5"
            aria-pressed={ecoute}
          >
            {ecoute ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {ecoute ? (en ? "Stop" : "Arrêter") : en ? "Dictate" : "Dicter"}
          </Button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MicOff className="h-3.5 w-3.5" />
            {ERREURS.indisponible[locale]}
          </span>
        )}

        {/* La saisie clavier reste offerte partout : la traduction fonctionne
            sans micro, et c'est le seul recours dans Firefox. */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs"
          onClick={() => setSaisieOuverte((v) => !v)}
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
          {en ? "Type it instead" : "L'écrire plutôt"}
        </Button>

        {ecoute && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {en ? "Listening…" : "À l'écoute…"}
          </span>
        )}
      </div>

      {saisieOuverte && (
        <div className="flex gap-2">
          <input
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                soumettreSaisie();
              }
            }}
            placeholder={EXEMPLES[locale][0]}
            aria-label={en ? "Sentence to translate into SQL" : "Phrase à traduire en SQL"}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          <Button type="button" size="sm" onClick={soumettreSaisie} disabled={!saisie.trim()}>
            {en ? "Translate" : "Traduire"}
          </Button>
        </div>
      )}

      {provisoire && (
        <p className="text-sm italic text-muted-foreground">« {provisoire} »</p>
      )}

      {erreur && (
        <p className="flex items-start gap-1.5 rounded-lg border border-warning/40 bg-warning/5 px-2.5 py-2 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          {ERREURS[erreur][locale]}
        </p>
      )}

      {resultat && (
        <div className="space-y-2 rounded-xl border border-border/70 bg-muted/30 p-3">
          <p className="text-sm">
            <span className="text-muted-foreground">{en ? "Heard: " : "Entendu : "}</span>
            <span className="font-medium">« {resultat.transcript} »</span>
          </p>

          {resultat.sql ? (
            <>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-card p-2.5 text-xs leading-relaxed">
                <code>{resultat.sql}</code>
              </pre>
              {resultat.compris.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {en ? "Understood: " : "Compris : "}
                  {resultat.compris.join(" · ")}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onQuery(resultat.sql!)}>
                  {en ? "Load and run" : "Charger et exécuter"}
                </Button>
                {resultat.valide === false && (
                  <span className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {en ? "This query does not run" : "Cette requête ne s'exécute pas"}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{resultat.message}</p>
              <ul className="space-y-1">
                {EXEMPLES[locale].map((exemple) => (
                  <li key={exemple}>
                    <button
                      type="button"
                      onClick={() => traduire(exemple)}
                      className="w-full rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-left text-xs transition-colors hover:border-primary"
                    >
                      « {exemple} »
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultat.sql && resultat.message && (
            <p className="text-xs text-muted-foreground">{resultat.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
