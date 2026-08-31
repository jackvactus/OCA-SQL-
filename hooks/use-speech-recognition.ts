"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n/locale";

/**
 * Reconnaissance vocale du navigateur.
 *
 * L'API Web Speech est native : aucune clé, aucun service à souscrire. Elle
 * n'est pas universelle pour autant — Chrome, Edge et Safari la proposent,
 * Firefox non — et Chrome envoie l'audio à un service distant pour le
 * transcrire. Les deux faits sont dits à l'apprenant plutôt que masqués : le
 * champ de saisie reste disponible partout, et la dictée n'est qu'un raccourci.
 *
 * Les types ne figurent pas dans la bibliothèque standard de TypeScript ; le
 * strict nécessaire est déclaré ici.
 */

interface ResultatVocal {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}

interface EvenementVocal extends Event {
  resultIndex: number;
  results: { length: number; [index: number]: ResultatVocal };
}

interface EvenementErreurVocale extends Event {
  error: string;
}

interface MoteurVocal extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: EvenementVocal) => void) | null;
  onerror: ((e: EvenementErreurVocale) => void) | null;
  onend: (() => void) | null;
}

type ConstructeurVocal = new () => MoteurVocal;

function constructeur(): ConstructeurVocal | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructeurVocal;
    webkitSpeechRecognition?: ConstructeurVocal;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type ErreurVocale = "refuse" | "silence" | "reseau" | "indisponible" | "autre";

export interface SpeechRecognitionState {
  /** Faux quand le navigateur ne sait pas transcrire — Firefox, notamment. */
  supporte: boolean;
  ecoute: boolean;
  /** Transcription définitive de la dernière phrase. */
  transcript: string;
  /** Transcription provisoire, affichée pendant que la personne parle. */
  provisoire: string;
  erreur: ErreurVocale | null;
  demarrer: () => void;
  arreter: () => void;
  reinitialiser: () => void;
}

export function useSpeechRecognition(
  locale: Locale,
  onPhrase?: (texte: string) => void,
): SpeechRecognitionState {
  const [supporte, setSupporte] = useState(false);
  const [ecoute, setEcoute] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [provisoire, setProvisoire] = useState("");
  const [erreur, setErreur] = useState<ErreurVocale | null>(null);
  const moteurRef = useRef<MoteurVocal | null>(null);

  // Le rappel est gardé dans une référence : sans cela, redéfinir la fonction
  // à chaque rendu recréerait le moteur et couperait la dictée en cours.
  const rappelRef = useRef(onPhrase);
  rappelRef.current = onPhrase;

  useEffect(() => {
    setSupporte(constructeur() !== null);
  }, []);

  const arreter = useCallback(() => {
    moteurRef.current?.stop();
    moteurRef.current = null;
    setEcoute(false);
    setProvisoire("");
  }, []);

  const demarrer = useCallback(() => {
    const Moteur = constructeur();
    if (!Moteur) {
      setErreur("indisponible");
      return;
    }

    // Une session déjà ouverte doit être fermée : `start()` sur un moteur en
    // cours lève une InvalidStateError.
    moteurRef.current?.abort();

    const moteur = new Moteur();
    moteur.lang = locale === "en" ? "en-US" : "fr-FR";
    moteur.continuous = false;
    moteur.interimResults = true;
    moteur.maxAlternatives = 1;

    moteur.onresult = (e) => {
      let definitif = "";
      let encours = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const resultat = e.results[i];
        if (resultat.isFinal) definitif += resultat[0].transcript;
        else encours += resultat[0].transcript;
      }
      setProvisoire(encours);
      if (definitif) {
        setTranscript(definitif);
        setProvisoire("");
        rappelRef.current?.(definitif.trim());
      }
    };

    moteur.onerror = (e) => {
      // Les libellés d'erreur de l'API sont techniques ; on les ramène à ce
      // que l'apprenant peut corriger.
      const table: Record<string, ErreurVocale> = {
        "not-allowed": "refuse",
        "service-not-allowed": "refuse",
        "no-speech": "silence",
        network: "reseau",
        aborted: "autre",
      };
      setErreur(table[e.error] ?? "autre");
      setEcoute(false);
    };

    moteur.onend = () => {
      setEcoute(false);
      setProvisoire("");
    };

    moteurRef.current = moteur;
    setErreur(null);
    setTranscript("");
    setProvisoire("");
    try {
      moteur.start();
      setEcoute(true);
    } catch {
      setErreur("autre");
      setEcoute(false);
    }
  }, [locale]);

  // Quitter la page pendant l'écoute laisserait le micro actif.
  useEffect(() => () => moteurRef.current?.abort(), []);

  const reinitialiser = useCallback(() => {
    setTranscript("");
    setProvisoire("");
    setErreur(null);
  }, []);

  return { supporte, ecoute, transcript, provisoire, erreur, demarrer, arreter, reinitialiser };
}
