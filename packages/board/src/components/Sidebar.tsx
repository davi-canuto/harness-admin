import type { Change, Status } from "../types.ts";
import { StatusBadge } from "./StatusBadge.tsx";

interface SidebarProps {
  changes: Change[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const STATUS_ORDER: Status[] = ["in_progress", "backlog", "done", "archived"];

export function Sidebar({ changes, selectedId, onSelect }: SidebarProps) {
  const counts: Record<Status, number> = {
    backlog: 0,
    in_progress: 0,
    done: 0,
    archived: 0,
  };
  for (const c of changes) counts[c.status]++;

  const sorted = [...changes].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  );

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 h-full overflow-y-auto">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-sm font-bold text-zinc-100 mb-3">Harness Admin</h1>
        <ul className="space-y-1 text-xs text-zinc-400">
          <li>
            <span className="text-zinc-500">backlog</span>{" "}
            <span className="font-medium text-zinc-200">{counts.backlog}</span>
          </li>
          <li>
            <span className="text-zinc-500">in progress</span>{" "}
            <span className="font-medium text-zinc-200">{counts.in_progress}</span>
          </li>
          <li>
            <span className="text-zinc-500">done</span>{" "}
            <span className="font-medium text-zinc-200">{counts.done}</span>
          </li>
          <li>
            <span className="text-zinc-500">archived</span>{" "}
            <span className="font-medium text-zinc-200">{counts.archived}</span>
          </li>
        </ul>
      </div>

      <nav className="flex-1 py-2">
        {sorted.map((change) => (
          <button
            key={change.id}
            onClick={() => onSelect(change.id)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-zinc-800 transition-colors ${
              selectedId === change.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-400"
            }`}
          >
            <span className="truncate flex-1">{change.name}</span>
            <StatusBadge status={change.status} />
          </button>
        ))}
      </nav>
    </aside>
  );
}
