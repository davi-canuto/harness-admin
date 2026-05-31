# Tasks: Apply by Task

## Server
- [ ] 13.1 Add `POST /api/changes/:id/apply` route — spawns `claude --print` with task + spec context, streams stdout/stderr via SSE, tracks running processes per change
- [ ] 13.2 Add `DELETE /api/changes/:id/apply` route — kills the running process for that change
- [ ] 13.3 Add `readFileSafe` helper that returns empty string if file does not exist
- [ ] 13.4 Kill all running processes on server shutdown (`app.addHook("onClose", ...)`)
- [ ] 13.5 Run `pnpm --filter @harness/server build` and confirm no TypeScript errors

## Board
- [ ] 13.6 Create `packages/board/src/hooks/useApply.ts` — SSE streaming, `start(taskIndex)` and `stop()` methods
- [ ] 13.7 Create `packages/board/src/components/ApplyPanel.tsx` — scrollable output pre, Stop button, auto-scroll to bottom, exit code display
- [ ] 13.8 Update `TaskList.tsx` — add `▶ Run` button on hover for incomplete tasks, only when `claudeAvailable` and `onRun` prop is provided
- [ ] 13.9 Update `ChangeDetail.tsx` — pass `onRun` to TaskList, render ApplyPanel when a task is running
- [ ] 13.10 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## Verification
- [ ] 13.11 Hover an incomplete task — verify `▶ Run` button appears
- [ ] 13.12 Click `▶ Run` — verify output panel opens and streams Claude's response
- [ ] 13.13 Click Stop — verify process is killed and panel shows interrupted status
- [ ] 13.14 Without `claude` CLI in PATH, verify Run button is disabled
