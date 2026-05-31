import type { Change } from "../types.ts";
import { StatusBadge } from "./StatusBadge.tsx";
import { ProgressBar } from "./ProgressBar.tsx";
import { TaskList } from "./TaskList.tsx";

export function ChangeDetail({ change }: { change: Change }) {
  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">{change.name}</h2>
        <StatusBadge status={change.status} />
      </div>

      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <span>
          {change.completedTasks}/{change.totalTasks} tasks
        </span>
        <span>{change.progress}%</span>
      </div>

      <ProgressBar value={change.progress} />

      <section>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Tasks
        </h3>
        <TaskList tasks={change.tasks} />
      </section>

      <section>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Artifacts
        </h3>
        <div className="flex gap-2">
          {change.hasProposal && (
            <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
              proposal.md
            </span>
          )}
          {change.hasDesign && (
            <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
              design.md
            </span>
          )}
          {change.hasTasks && (
            <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
              tasks.md
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
