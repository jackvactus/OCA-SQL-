import { CheckCircle2, FileCode, Play } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function SandboxPreview({ t }: { t: Dictionary }) {
  const rows = [
    ["176", "Jonathon", "Taylor", "8600"],
    ["201", "Michael", "Hartstein", "13000"],
    ["149", "Eleni", "Zlotkey", "10500"],
    ["124", "Kevin", "Mourgos", "5800"],
    ["103", "Alexander", "Hunold", "9000"],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#0d1117] shadow-xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-2 flex items-center gap-1.5 text-xs text-white/50">
          <FileCode className="h-3.5 w-3.5" />
          {t.marketing.sandboxFileLabel}
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-md bg-primary/20 px-2 py-1 text-[11px] font-medium text-primary">
          <Play className="h-3 w-3 fill-current" />
          {t.marketing.sandboxRunLabel}
        </div>
      </div>

      {/* Query */}
      <div className="px-4 py-4 font-mono text-[13px] leading-relaxed">
        <div>
          <span className="text-sky-400">SELECT</span>{" "}
          <span className="text-violet-300">employee_id, first_name, last_name, salary</span>
        </div>
        <div>
          <span className="text-sky-400">FROM</span> <span className="text-violet-300">employees</span>
        </div>
        <div>
          <span className="text-sky-400">WHERE</span> <span className="text-violet-300">department_id</span>{" "}
          <span className="text-pink-400">=</span> <span className="text-amber-300">80</span>
        </div>
        <div>
          <span className="text-sky-400">ORDER BY</span> <span className="text-violet-300">salary</span>{" "}
          <span className="text-sky-400">DESC</span>
        </div>
        <div>
          <span className="text-sky-400">FETCH FIRST</span> <span className="text-amber-300">5</span>{" "}
          <span className="text-sky-400">ROWS ONLY</span>
          <span className="text-white/40">;</span>
        </div>
      </div>

      {/* Result */}
      <div className="border-t border-white/10 bg-black/20 px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          5 {t.marketing.sandboxResultLabel}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="text-white/40">
                <th className="py-1 pr-4 font-normal">EMPLOYEE_ID</th>
                <th className="py-1 pr-4 font-normal">FIRST_NAME</th>
                <th className="py-1 pr-4 font-normal">LAST_NAME</th>
                <th className="py-1 font-normal">SALARY</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="text-white/70">
                  <td className="py-0.5 pr-4">{row[0]}</td>
                  <td className="py-0.5 pr-4">{row[1]}</td>
                  <td className="py-0.5 pr-4">{row[2]}</td>
                  <td className="py-0.5 text-sky-300">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
