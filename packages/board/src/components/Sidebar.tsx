import { useState } from "react";
import type { Change, Status } from "../types.ts";
import { StatCard } from "./StatCard.tsx";
import { PlayIcon, ClockIcon, CheckIcon, ArchiveIcon, ChevronIcon } from "./icons.tsx";

interface SidebarProps {
  changes: Change[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SECTIONS: { status: Status; label: string; collapsible: boolean }[] = [
  { status: "in_progress", label: "In Progress", collapsible: false },
  { status: "backlog",     label: "Backlog",     collapsible: false },
  { status: "done",        label: "Done",        collapsible: false },
  { status: "archived",    label: "Archived",    collapsible: true  },
];

export function Sidebar({ changes, selectedId, onSelect }: SidebarProps) {
  const [archivedOpen, setArchivedOpen] = useState(false);

  const counts: Record<Status, number> = {
    backlog: 0, in_progress: 0, done: 0, archived: 0,
  };
  for (const c of changes) counts[c.status]++;

  const byStatus: Record<Status, Change[]> = {
    backlog: [], in_progress: [], done: [], archived: [],
  };
  for (const c of changes) byStatus[c.status].push(c);

  return (
    <aside className="flex flex-col w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harness Admin</h1>
      </div>

      <div className="grid grid-cols-4 gap-1 px-2 pb-2 border-b border-zinc-800">
        <StatCard icon={<PlayIcon />}    count={counts.in_progress} label="active"   color="text-blue-400" />
        <StatCard icon={<ClockIcon />}   count={counts.backlog}     label="backlog"  color="text-amber-400" />
        <StatCard icon={<CheckIcon />}   count={counts.done}        label="done"     color="text-green-400" />
        <StatCard icon={<ArchiveIcon />} count={counts.archived}    label="archived" color="text-zinc-500" />
      </div>

      <nav className="flex-1 py-1">
        {SECTIONS.map(({ status, label, collapsible }) => {
          const items = byStatus[status];
          if (items.length === 0) return null;

          const isOpen = collapsible ? archivedOpen : true;

          return (
            <div key={status}>
              <button
                onClick={() => collapsible && setArchivedOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase ${
                  collapsible ? "hover:text-zinc-300 cursor-pointer" : "cursor-default"
                }`}
              >
                <span>{label} <span className="font-normal normal-case tracking-normal text-zinc-600">{items.length}</span></span>
                {collapsible && <ChevronIcon open={archivedOpen} />}
              </button>

              {isOpen && items.map((change) => (
                <button
                  key={change.id}
                  onClick={() => onSelect(change.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm gap-3 border-l-2 transition-colors text-left ${
                    selectedId === change.id
                      ? "border-blue-400 bg-zinc-800/60 text-zinc-100"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                  }`}
                >
                  <span className="flex-1 break-words leading-snug">{change.name}</span>
                  {change.totalTasks > 0 && (
                    <span className="text-[11px] text-zinc-600 tabular-nums shrink-0">
                      {change.completedTasks}/{change.totalTasks}
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
