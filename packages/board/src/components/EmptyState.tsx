import type { Status } from "../types.ts";
import { InboxIcon } from "./icons.tsx";

interface EmptyStateProps {
  counts: Record<Status, number>;
}

export function EmptyState({ counts }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-[radial-gradient(ellipse_at_center,_#27272a_0%,_#09090b_70%)]">
      <span className="text-zinc-700">
        <InboxIcon />
      </span>
      <p className="text-zinc-400 font-medium text-sm">Pick a change from the sidebar</p>
      <p className="text-zinc-600 text-xs">
        {counts.in_progress} in progress · {counts.done} done · {counts.archived} archived
      </p>
    </div>
  );
}
