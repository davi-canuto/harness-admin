# Design: Apply by Task

## Files changed

| File | Action |
|---|---|
| `packages/server/src/routes.ts` | Add `POST /api/changes/:id/apply` with SSE streaming |
| `packages/board/src/components/TaskList.tsx` | Add `▶ Run` button on hover per incomplete task |
| `packages/board/src/components/ApplyPanel.tsx` | New — streaming output terminal panel |
| `packages/board/src/hooks/useApply.ts` | New — SSE streaming + process control |

---

## Server — apply route (`routes.ts`)

```ts
// POST /api/changes/:id/apply
// Body: { taskIndex: number }
// Response: SSE stream of stdout/stderr lines + done event

const runningProcesses = new Map<string, ChildProcess>();

app.post<{ Params: { id: string } }>("/api/changes/:id/apply", async (request, reply) => {
  const { taskIndex } = request.body as { taskIndex: number };
  const change = watcher.getAll().find((c) => c.id === request.params.id);
  if (!change) return reply.status(404).send({ error: "Change not found" });
  if (runningProcesses.has(change.id)) return reply.status(409).send({ error: "Already running" });

  const task = change.tasks[taskIndex];
  if (!task) return reply.status(400).send({ error: "Task not found" });

  const proposal = readFileSafe(join(change.path, config.proposalFile));
  const design   = readFileSafe(join(change.path, config.designFile));
  const tasks    = readFileSafe(join(change.path, config.tasksFile));

  const prompt = [
    `You are implementing task ${taskIndex + 1} from the SDD change "${change.name}":`,
    ``,
    `Task: ${task.label}`,
    ``,
    `## proposal.md`,  proposal,
    `## design.md`,    design,
    `## tasks.md`,     tasks,
    ``,
    `Implement this task in the project at ${rootDir}. Focus only on this specific task.`,
  ].join("\n");

  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");

  const proc = spawn("claude", ["--print", prompt], { cwd: rootDir, shell: true });
  runningProcesses.set(change.id, proc);

  const send = (type: string, data: string) =>
    reply.raw.write(`data: ${JSON.stringify({ type, data })}\n\n`);

  proc.stdout.on("data", (chunk) => send("stdout", chunk.toString()));
  proc.stderr.on("data", (chunk) => send("stderr", chunk.toString()));
  proc.on("close", (code) => {
    runningProcesses.delete(change.id);
    reply.raw.write(`data: ${JSON.stringify({ type: "done", exitCode: code })}\n\n`);
    reply.raw.end();
  });
});

// DELETE /api/changes/:id/apply  — kill running process
app.delete<{ Params: { id: string } }>("/api/changes/:id/apply", async (request, reply) => {
  const proc = runningProcesses.get(request.params.id);
  if (!proc) return reply.status(404).send({ error: "No running process" });
  proc.kill();
  return { ok: true };
});
```

---

## Board — TaskList with Run button

```tsx
<li key={task.id} className="flex items-start gap-3 group">
  {/* existing number + icon + label */}
  ...
  {!task.completed && claudeAvailable && (
    <button
      onClick={() => onRun(index)}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0 text-[10px] text-zinc-500 hover:text-blue-400 px-1.5 py-0.5 rounded border border-transparent hover:border-zinc-700"
    >
      ▶ Run
    </button>
  )}
</li>
```

`onRun` is passed from `ChangeDetail`, which opens the `ApplyPanel`.

---

## Board — ApplyPanel (`ApplyPanel.tsx`)

Slide-in panel at the bottom of the detail view. Shows a scrollable `<pre>` with output lines, colored by type (stdout = zinc, stderr = red/amber). Stop button calls `DELETE /api/changes/:id/apply`.

```tsx
interface ApplyPanelProps {
  changeId: string;
  taskIndex: number;
  taskLabel: string;
  onClose: () => void;
}
```

Auto-scrolls to bottom as new lines arrive. Persists output after process ends until explicitly closed.

---

## useApply hook (`useApply.ts`)

Same SSE pattern as `useChat` — reads the stream, appends lines to state, handles `done` event. Exposes `{ lines, running, start, stop }`.
