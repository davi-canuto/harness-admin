import { useState } from "react";
import { useChanges } from "./hooks/useChanges.ts";
import { Sidebar } from "./components/Sidebar.tsx";
import { ChangeDetail } from "./components/ChangeDetail.tsx";

export default function App() {
  const { changes, loading, error } = useChanges();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = changes.find((c) => c.id === selectedId) ?? null;

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
          <ChangeDetail change={selected} />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            Select a change
          </div>
        )}
      </main>
    </div>
  );
}
