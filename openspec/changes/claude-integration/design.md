# Design: Claude Integration

## Files changed

| File | Action |
|---|---|
| `packages/server/src/routes.ts` | Add `POST /api/changes/:id/chat` with SSE streaming |
| `packages/server/package.json` | Add `@anthropic-ai/sdk` dependency |
| `packages/server/src/index.ts` | Pass `ANTHROPIC_API_KEY` presence to routes |
| `packages/board/src/components/ChangeDetail.tsx` | Add tab bar (Tasks / Chat) |
| `packages/board/src/components/ChatPanel.tsx` | New — message thread + input |
| `packages/board/src/hooks/useChat.ts` | New — SSE streaming hook |
| `packages/board/src/types.ts` | Add `ChatMessage` type |

---

## Server — chat route (`routes.ts`)

```ts
// POST /api/changes/:id/chat
// Body: { messages: { role: "user" | "assistant", content: string }[] }
// Response: SSE stream of text deltas + done event
```

System prompt construction:
```ts
function buildSystemPrompt(change: Change, files: Record<string, string>): string {
  return [
    `You are helping implement the SDD change "${change.name}".`,
    ``,
    `## proposal.md`,
    files.proposal || "(not found)",
    ``,
    `## design.md`,
    files.design || "(not found)",
    ``,
    `## tasks.md`,
    files.tasks || "(not found)",
  ].join("\n");
}
```

Streaming:
```ts
reply.raw.setHeader("Content-Type", "text/event-stream");
reply.raw.setHeader("Cache-Control", "no-cache");

const stream = await anthropic.messages.stream({
  model: config.claudeModel ?? "claude-sonnet-4-6",
  max_tokens: 8096,
  system: systemPrompt,
  messages,
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    reply.raw.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
  }
}
reply.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`);
reply.raw.end();
```

---

## Board — ChatPanel (`ChatPanel.tsx`)

```tsx
interface ChatPanelProps {
  changeId: string;
  changeName: string;
}

// Shows: system context notice → message thread → input box
// useChat hook manages SSE connection and message state
```

Message thread renders alternating user/assistant bubbles. Assistant messages stream in token-by-token via the SSE hook.

---

## Board — useChat hook (`useChat.ts`)

```ts
export function useChat(changeId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);

  const send = async (content: string) => {
    const userMsg = { role: "user" as const, content };
    const allMessages = [...messages, userMsg];
    setMessages([...allMessages, { role: "assistant", content: "" }]);
    setStreaming(true);

    const res = await fetch(`/api/changes/${changeId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: allMessages }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = JSON.parse(line.slice(6));
        if (payload.done) { setStreaming(false); return; }
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + payload.text };
          return next;
        });
      }
    }
    setStreaming(false);
  };

  return { messages, streaming, send };
}
```

---

## Tab bar in ChangeDetail

```tsx
const [tab, setTab] = useState<"tasks" | "chat">("tasks");

// header tabs
<div className="flex gap-1 border-b border-zinc-800 mb-4">
  <button onClick={() => setTab("tasks")} className={tab === "tasks" ? "...active..." : "..."}>Tasks</button>
  {claudeAvailable && (
    <button onClick={() => setTab("chat")} className={tab === "chat" ? "...active..." : "..."}>Chat</button>
  )}
</div>

{tab === "tasks" ? <TaskList tasks={change.tasks} /> : <ChatPanel changeId={change.id} changeName={change.name} />}
```

`claudeAvailable` comes from the `/api/changes` response — the server adds `{ claudeAvailable: !!process.env.ANTHROPIC_API_KEY }` to the API response or a separate `/api/config` endpoint.
