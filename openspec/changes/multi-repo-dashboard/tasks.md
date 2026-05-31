# Tasks: Multi-Repo Dashboard

## Parser
- [x] 14.1 Add `project?: string` field to `Change` interface in `packages/parser/src/types.ts`

## Server
- [x] 14.2 Update `Config` type to include `projects?: { name: string; path: string }[]`
- [x] 14.3 Update `startServer` to instantiate one watcher per project entry; fall back to single-project behavior when `projects` is not set
- [x] 14.4 Update `GET /api/changes` to accept `?project=name` query param
- [x] 14.5 Add `GET /api/changes/all` returning all changes across all projects with `project` field populated
- [x] 14.6 Tag WebSocket events with `project` field when multi-project mode is active
- [x] 14.7 Run `pnpm --filter @harness/server build` and confirm no TypeScript errors

## CLI
- [x] 14.8 Update `loadConfig` in `packages/cli/src/config.ts` to parse `projects` array

## Board
- [x] 14.9 Add `project?: string` to `Change` type in `packages/board/src/types.ts`
- [x] 14.10 Update `useChanges.ts` to accept and pass `activeProject` state; fetch from `/api/changes/all` when `null`
- [x] 14.11 Create `packages/board/src/components/ProjectSwitcher.tsx` — dropdown with project names + "All projects"
- [x] 14.12 Update `Sidebar.tsx` — render `ProjectSwitcher` in header when multiple projects exist; show project badge on each change row in "All projects" mode
- [x] 14.13 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## Verification
- [x] 14.14 Configure `harness.config.json` with two projects, start server, verify both appear in the switcher
- [x] 14.15 Switch between projects and verify the change list updates
- [x] 14.16 Select "All projects" and verify changes from both appear with project badges
- [x] 14.17 Edit a `tasks.md` in one project and verify only that project's changes update via WebSocket
