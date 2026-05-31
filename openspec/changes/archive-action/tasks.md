# Tasks: Archive Action

## Server
- [x] 11.1 Add `POST /api/changes/:id/archive` route to `packages/server/src/routes.ts` — moves `change.path` to `archiveDir/<name>` using `fs/promises rename`, returns 400 if already archived, 409 if name conflict
- [x] 11.2 Run `pnpm --filter @harness/server build` and confirm no TypeScript errors

## Board
- [x] 11.3 Create `packages/board/src/components/ArchiveButton.tsx` — idle → confirming → loading state machine with inline confirmation
- [x] 11.4 Add `ArchiveButton` to `ChangeDetail.tsx` footer, hidden when `status === "archived"`
- [x] 11.5 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## Verification
- [x] 11.6 Start the server against a test project, select an in-progress change, click Archive, confirm, and verify the change moves to Archived section in the sidebar
- [x] 11.7 Verify the Archive button is absent on already-archived changes
- [x] 11.8 Verify the WebSocket update reflects the status change without a page reload
