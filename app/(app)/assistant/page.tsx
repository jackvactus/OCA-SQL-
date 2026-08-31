"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { History, Loader2, Sparkles, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";
import { assistantStrings } from "@/lib/assistant/strings";
import { ExchangeView, SqlBlock } from "@/components/assistant/transcript";
import type { AssistantExchange, AssistantSql } from "@/lib/assistant/types";

type Transcrit = AssistantExchange & { path?: string | null; track?: string | null };

/**
 * Audit de l'assistant : la transcription complète.
 *
 * Deux lectures du même journal. « Conversation » restitue les échanges tels
 * qu'ils se sont déroulés, avec la page d'où la question a été posée. « SQL
 * proposé » n'extrait que les requêtes, parce que c'est ce qu'on revient
 * vérifier : une requête suggérée par l'assistant doit pouvoir être relue et
 * ré-exécutée hors du fil de discussion qui l'a produite.
 */
export default function AssistantAuditPage() {
  const { locale } = useLanguage();
  const s = assistantStrings(locale);

  const [exchanges, setExchanges] = useState<Transcrit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [suppression, setSuppression] = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const reponse = await fetch("/api/assistant/transcript");
      if (reponse.ok) {
        const donnees = await reponse.json();
        setExchanges(Array.isArray(donnees.exchanges) ? donnees.exchanges : []);
      }
    } catch {
      /* la transcription reste vide, la page reste lisible */
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const effacer = async () => {
    setSuppression(true);
    try {
      await fetch("/api/assistant/transcript", { method: "DELETE" });
      setExchanges([]);
    } catch {
      /* rien à faire de plus côté client */
    } finally {
      setSuppression(false);
    }
  };

  // Les requêtes, extraites du fil, la plus récente d'abord et sans doublon :
  // reposer deux fois la même question ne doit pas allonger la liste.
  const requetes = useMemo(() => {
    const vues = new Set<string>();
    const sortie: { sql: AssistantSql; question: string; createdAt: string }[] = [];
    for (const echange of exchanges) {
      for (const sql of echange.answer.sql) {
        const cle = sql.query.trim();
        if (vues.has(cle)) continue;
        vues.add(cle);
        sortie.push({ sql, question: echange.question, createdAt: echange.createdAt });
      }
    }
    return sortie;
  }, [exchanges]);

  return (
    <div className="min-h-screen bg-grid">
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{s.auditTitle}</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{s.auditSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <History className="h-3.5 w-3.5" />
                {s.auditCount(exchanges.length)}
              </Badge>
              {exchanges.length > 0 && (
                <Button variant="outline" size="sm" onClick={effacer} disabled={suppression}>
                  {suppression ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {s.clear}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {chargement ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {s.thinking}
          </div>
        ) : exchanges.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {s.auditEmpty}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="conversation">
            <TabsList className="mb-4">
              <TabsTrigger value="conversation">{s.auditAll}</TabsTrigger>
              <TabsTrigger value="sql">
                {s.auditSql}
                {requetes.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">{requetes.length}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="space-y-6">
              {exchanges.map((echange) => (
                <Card key={echange.id}>
                  <CardContent className="pt-6">
                    <ExchangeView exchange={echange} s={s} showMeta />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="sql" className="space-y-4">
              {requetes.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    {s.auditSqlEmpty}
                  </CardContent>
                </Card>
              ) : (
                requetes.map((entree, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {entree.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SqlBlock sql={entree.sql} s={s} />
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
