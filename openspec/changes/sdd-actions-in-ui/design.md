# Design: SDD Actions in UI

## Files changed

| File | Action |
|---|---|
| `packages/server/src/routes.ts` | Add `POST /api/changes/propose` (SSE) and `POST /api/changes/create` |
| `packages/server/package.json` | `@anthropic-ai/sdk` (shared with claude-integration) |
| `packages/board/src/components/Sidebar.tsx` | Add `+ New Change` button in header |
| `packages/board/src/components/NewChangeModal.tsx` | New — full propose flow |
| `packages/board/src/hooks/usePropose.ts` | New — SSE streaming for file generation |

---

## Server — propose route (`routes.ts`)

```ts
// POST /api/changes/propose
// Body: { description: string }
// Response: SSE — streams proposal, design, tasks as they're generated

app.post("/api/changes/propose", async (request, reply) => {
  const { description } = request.body as { description: string };

  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");

  const send = (event: string, data: string) =>
    reply.raw.write(`event: ${event}\ndata: ${JSON.stringify({ content: data })}\n\n`);

  // Generate slug
  const slug = description
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  send("slug", slug);

  // Generate proposal.md
  const proposalStream = await anthropic.messages.stream({
    model: config.claudeModel ?? "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Write a proposal.md for an SDD change: "${description}"\n\nFormat:\n# Proposal: [Title]\n\n## Problem\n[problem statement]\n\n## Proposed Solution\n[solution]`
    }]
  });
  for await (const chunk of proposalStream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      send("proposal", chunk.delta.text);
    }
  }
  send("proposal_done", "");

  // Generate design.md (similar streaming)
  // Generate tasks.md (similar streaming)

  send("done", slug);
  reply.raw.end();
});
```

---

## Server — create route (`routes.ts`)

```ts
// POST /api/changes/create
// Body: { slug, proposal, design, tasks }

app.post("/api/changes/create", async (request, reply) => {
  const { slug, proposal, design, tasks } = request.body as CreateBody;

  const targetDir = join(rootDir, config.changesDir, slug);
  if (existsSync(targetDir)) return reply.status(409).send({ error: "Change already exists" });

  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, config.proposalFile), proposal);
  writeFileSync(join(targetDir, config.designFile), design);
  writeFileSync(join(targetDir, config.tasksFile), tasks);

  return { ok: true, id: slug };
});
```

The watcher detects the new directory and broadcasts `change_added` automatically.

---

## Board — NewChangeModal (`NewChangeModal.tsx`)

Three phases:

**Phase 1 — input:** Single text input "What are you building?" + Generate button.

**Phase 2 — streaming:** Three file panels side by side, each filling in as SSE streams in. Spinner on each panel header until `*_done` event arrives.

**Phase 3 — review:** All three panels become editable textareas. Slug field is editable. Create Change button becomes active.

```tsx
type Phase = "input" | "generating" | "review";
```

Modal is full-screen overlay (`fixed inset-0 bg-zinc-950/80 backdrop-blur`). Inner panel is centered, `max-w-4xl`, `h-[80vh]`.

---

## Board — usePropose hook (`usePropose.ts`)

```ts
export function usePropose() {
  const [slug, setSlug] = useState("");
  const [proposal, setProposal] = useState("");
  const [design, setDesign] = useState("");
  const [tasks, setTasks] = useState("");
  const [phase, setPhase] = useState<Phase>("input");

  const generate = async (description: string) => {
    setPhase("generating");
    const res = await fetch("/api/changes/propose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    // parse SSE events, update state per file
    // on "done" event → setPhase("review")
  };

  const create = async () => {
    await fetch("/api/changes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, proposal, design, tasks }),
    });
  };

  return { slug, setSlug, proposal, setProposal, design, setDesign, tasks, setTasks, phase, generate, create };
}
```

---

## Sidebar — New Change button

```tsx
<button
  onClick={openModal}
  className="ml-auto text-zinc-600 hover:text-zinc-300 transition-colors"
  title="New Change"
>
  <PlusIcon />  {/* 14×14 inline SVG */}
</button>
```

Placed in the sidebar header row next to the `Harness` title. Disabled (with tooltip) if `claudeAvailable === false`.
