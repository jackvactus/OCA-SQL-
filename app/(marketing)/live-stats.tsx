"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { BookOpenCheck, Radio, Users } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary";

interface PublicStats {
  totalUsers: number;
  totalLessonsCompleted: number;
  dailyActivity: { day: string; count: number }[];
}

export function LiveStats({ t }: { t: Dictionary }) {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const chartData = (stats?.dailyActivity ?? []).map((d) => ({
    day: d.day.slice(5),
    count: d.count,
  }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t.marketing.liveTitle}</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          <Radio className="h-3 w-3 animate-pulse" />
          {t.marketing.liveBadge}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {t.marketing.liveLearners}
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums">{stats?.totalUsers ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpenCheck className="h-3.5 w-3.5" />
            {t.marketing.liveLessonsCompleted}
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums">{stats?.totalLessonsCompleted ?? "—"}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs text-muted-foreground">{t.marketing.liveActivityLabel}</p>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="liveActivityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name={t.marketing.liveActivityLabel}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#liveActivityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">{t.marketing.liveFooter}</p>
    </div>
  );
}
