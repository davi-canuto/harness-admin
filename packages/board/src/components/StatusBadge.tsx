import type { Status } from "../types.ts";

const STYLES: Record<Status, string> = {
  backlog: "bg-zinc-700 text-zinc-300",
  in_progress: "bg-blue-900 text-blue-300",
  done: "bg-green-900 text-green-300",
  archived: "bg-zinc-800 text-zinc-500",
};

const LABELS: Record<Status, string> = {
  backlog: "backlog",
  in_progress: "in progress",
  done: "done",
  archived: "archived",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
