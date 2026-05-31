import type { Change } from "../types.ts";
import { StatusBadge } from "./StatusBadge.tsx";
import { ProgressBar } from "./ProgressBar.tsx";
import { TaskList } from "./TaskList.tsx";
import { ParentDetail } from "./ParentDetail.tsx";

const ARTIFACTS = [
  { key: "hasProposal" as const, label: "proposal.md" },
  { key: "hasDesign"   as const, label: "design.md"   },
  { key: "hasTasks"    as const, label: "tasks.md"    },
];

export function ChangeDetail({ change, onSelectChild }: { change: Change; onSelectChild: (id: string) => void }) {
  if (change.children) {
    return <ParentDetail change={change} onSelectChild={onSelectChild} />;
  }
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
          <span className="tabular-nums">{change.completedTasks}/{change.totalTasks} tasks</span>
          <span className="text-zinc-700">·</span>
          <span className="tabular-nums font-medium text-zinc-300">{change.progress}%</span>
        </div>

        <div className="mt-3">
          <ProgressBar value={change.progress} inProgress={change.status === "in_progress"} />
        </div>
      </div>

      <section>
        <h3 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Tasks
        </h3>
        <TaskList tasks={change.tasks} />
      </section>

      <section>
        <h3 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">
          Artifacts
        </h3>
        <div className="flex gap-2 flex-wrap">
          {ARTIFACTS.map(({ key, label }) => (
            <span
              key={key}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                change[key]
                  ? "border-zinc-600 text-zinc-300 bg-zinc-800"
                  : "border-zinc-800 text-zinc-600 line-through"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
