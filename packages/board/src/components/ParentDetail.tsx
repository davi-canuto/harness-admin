import type { Change } from "../types.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { StatusBadge } from "./StatusBadge.tsx";

interface ParentDetailProps {
  change: Change;
  onSelectChild: (id: string) => void;
}

export function ParentDetail({ change, onSelectChild }: ParentDetailProps) {
  return (
    <div className="flex flex-col gap-5 p-6 h-full overflow-y-auto">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-zinc-100 leading-tight break-words">
            {change.name}
          </h2>
          <StatusBadge status={change.status} />
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1.5">
          <span className="tabular-nums">{change.completedTasks}/{change.totalTasks} tasks across {change.children!.length} sub-changes</span>
          <span className="text-zinc-700">·</span>
          <span className="tabular-nums font-medium text-zinc-300">{change.progress}%</span>
        </div>

        <div className="mt-3">
          <ProgressBar value={change.progress} inProgress={change.status === "in_progress"} />
        </div>
      </div>

      <section>
        <h3 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Sub-changes
        </h3>
        <div className="flex flex-col gap-2">
          {change.children!.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 hover:border-zinc-700 transition-colors text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-200 break-words leading-snug">
                  {child.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-zinc-500 tabular-nums">
                    {child.completedTasks}/{child.totalTasks}
                  </span>
                  <StatusBadge status={child.status} />
                </div>
              </div>
              {child.totalTasks > 0 && (
                <ProgressBar value={child.progress} inProgress={child.status === "in_progress"} />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
