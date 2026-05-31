import { useState, useRef, useCallback } from "react";
import type { Change, Status } from "../types.ts";
import { StatCard } from "./StatCard.tsx";
import { PlayIcon, ClockIcon, CheckIcon, ArchiveIcon, ChevronIcon } from "./icons.tsx";

interface SidebarProps {
  changes: Change[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SECTIONS: { status: Status; label: string }[] = [
  { status: "in_progress", label: "In Progress" },
  { status: "backlog",     label: "Backlog"     },
  { status: "done",        label: "Done"        },
  { status: "archived",    label: "Archived"    },
];

const MIN_WIDTH = 200;
const MAX_WIDTH = 520;
const DEFAULT_WIDTH = 288;

export function Sidebar({ changes, selectedId, onSelect }: SidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState<Partial<Record<Status, boolean>>>({
    archived: true,
  });
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + ev.clientX - startX.current));
      setWidth(next);
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [width]);

  const toggleSection = (status: Status) => {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const counts: Record<Status, number> = {
    backlog: 0, in_progress: 0, done: 0, archived: 0,
  };
  for (const c of changes) counts[c.status]++;

  const byStatus: Record<Status, Change[]> = {
    backlog: [], in_progress: [], done: [], archived: [],
  };
  for (const c of changes) byStatus[c.status].push(c);

  return (
    <aside
      className="relative flex shrink-0 border-r border-zinc-800 bg-zinc-950 h-full"
      style={{ width }}
    >
      <div className="flex flex-col h-full w-full overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harness</h1>
        </div>

        <div className="grid grid-cols-4 gap-1 px-2 pb-2 border-b border-zinc-800">
          <StatCard icon={<PlayIcon />}    count={counts.in_progress} label="active"   color="text-blue-400" />
          <StatCard icon={<ClockIcon />}   count={counts.backlog}     label="backlog"  color="text-amber-400" />
          <StatCard icon={<CheckIcon />}   count={counts.done}        label="done"     color="text-green-400" />
          <StatCard icon={<ArchiveIcon />} count={counts.archived}    label="archived" color="text-zinc-500" />
        </div>

        <nav className="flex-1 py-1">
          {SECTIONS.map(({ status, label }) => {
            const items = byStatus[status];
            if (items.length === 0) return null;
            const isOpen = !collapsed[status];

            return (
              <div key={status}>
                <button
                  onClick={() => toggleSection(status)}
                  className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <span>
                    {label}{" "}
                    <span className="font-normal normal-case tracking-normal text-zinc-600">
                      {items.length}
                    </span>
                  </span>
                  <ChevronIcon open={isOpen} />
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
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        className="sidebar-resize-handle absolute top-0 right-0 w-1 h-full transition-colors"
      />
    </aside>
  );
}
