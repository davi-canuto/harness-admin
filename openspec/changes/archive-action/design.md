# Design: Archive Action

## Files changed

| File | Action |
|---|---|
| `packages/server/src/routes.ts` | Add `POST /api/changes/:id/archive` |
| `packages/board/src/components/ChangeDetail.tsx` | Add Archive button + confirmation |
| `packages/board/src/components/ArchiveButton.tsx` | New — button + inline confirmation state |

---

## Server (`routes.ts`)

```ts
app.post<{ Params: { id: string } }>("/api/changes/:id/archive", async (request, reply) => {
  const change = watcher.getAll().find((c) => c.id === request.params.id);
  if (!change) return reply.status(404).send({ error: "Change not found" });
  if (change.status === "archived") return reply.status(400).send({ error: "Already archived" });

  const targetPath = join(config.archiveDir, change.name);
  if (existsSync(targetPath)) return reply.status(409).send({ error: "Name conflict in archive" });

  await rename(change.path, targetPath);   // fs/promises rename
  return { ok: true };
});
```

The watcher detects the move via chokidar and automatically emits `change_removed` for the old path and `change_added` for the new archived path. No manual broadcast needed.

---

## Board — ArchiveButton (`ArchiveButton.tsx`)

```tsx
type State = "idle" | "confirming" | "loading";

export function ArchiveButton({ changeId, onArchived }: { changeId: string; onArchived: () => void }) {
  const [state, setState] = useState<State>("idle");

  const confirm = async () => {
    setState("loading");
    const res = await fetch(`/api/changes/${changeId}/archive`, { method: "POST" });
    if (res.ok) {
      onArchived();
    } else {
      const { error } = await res.json();
      alert(error);  // fallback, replace with toast post-MVP
      setState("idle");
    }
  };

  if (state === "idle") {
    return (
      <button onClick={() => setState("confirming")} className="...zinc outlined...">
        Archive
      </button>
    );
  }

  if (state === "confirming") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Move to archive?</span>
        <button onClick={confirm} className="...amber...">Confirm</button>
        <button onClick={() => setState("idle")} className="...zinc...">Cancel</button>
      </div>
    );
  }

  return <span className="text-xs text-zinc-500">Archiving…</span>;
}
```

---

## Board — ChangeDetail integration

Add `ArchiveButton` to the artifacts section footer, only when `change.status !== "archived"`:

```tsx
{change.status !== "archived" && (
  <ArchiveButton changeId={change.id} onArchived={() => {/* selection clears via WS update */}} />
)}
```

`onArchived` can be a no-op — the WebSocket `change_updated` event will update the change status to `archived` automatically, which re-renders the sidebar and detail panel.
