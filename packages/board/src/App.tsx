import { useState } from "react";
import { useChanges } from "./hooks/useChanges.ts";
import { Sidebar } from "./components/Sidebar.tsx";
import { ChangeDetail } from "./components/ChangeDetail.tsx";
import { EmptyState } from "./components/EmptyState.tsx";
import type { Status } from "./types.ts";

export default function App() {
  const { changes, loading, error } = useChanges();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // look in top-level changes and inside children
  const selected =
    changes.find((c) => c.id === selectedId) ??
    changes.flatMap((c) => c.children ?? []).find((c) => c.id === selectedId) ??
    null;

  const counts: Record<Status, number> = {
    backlog: 0, in_progress: 0, done: 0, archived: 0,
  };
  for (const c of changes) counts[c.status]++;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950 text-zinc-500 text-sm">
        Connecting...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-zinc-900 text-zinc-100">
      <Sidebar changes={changes} selectedId={selectedId} onSelect={setSelectedId} />
      <main className="flex-1 h-full overflow-hidden">
        {selected ? (
          <ChangeDetail change={selected} onSelectChild={setSelectedId} />
        ) : (
          <EmptyState counts={counts} />
        )}
      </main>
    </div>
  );
}
