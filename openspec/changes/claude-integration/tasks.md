# Tasks: Claude Integration

## Server
- [ ] 12.1 Add `@anthropic-ai/sdk` to `packages/server/package.json`
- [ ] 12.2 Add `GET /api/config` route returning `{ claudeAvailable: boolean }` based on `ANTHROPIC_API_KEY` presence
- [ ] 12.3 Add `POST /api/changes/:id/chat` route — reads spec files, builds system prompt, streams Claude response via SSE
- [ ] 12.4 Run `pnpm --filter @harness/server build` and confirm no TypeScript errors

## Board
- [ ] 12.5 Add `ChatMessage` type to `packages/board/src/types.ts`
- [ ] 12.6 Create `packages/board/src/hooks/useChat.ts` — SSE streaming, message history management
- [ ] 12.7 Create `packages/board/src/components/ChatPanel.tsx` — message thread with user/assistant bubbles, streaming indicator, input box
- [ ] 12.8 Update `ChangeDetail.tsx` — add Tasks/Chat tab bar, render `ChatPanel` when chat tab is active and `claudeAvailable`
- [ ] 12.9 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## Verification
- [ ] 12.10 Set `ANTHROPIC_API_KEY`, select a change with proposal.md + tasks.md, open Chat tab, send "summarize this change" — verify streamed response references the actual spec content
- [ ] 12.11 Without `ANTHROPIC_API_KEY` set, verify Chat tab is hidden
