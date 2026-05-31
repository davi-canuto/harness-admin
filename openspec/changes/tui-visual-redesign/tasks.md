# Tasks: TUI Visual Redesign

## Components

- [x] 8.1 Create `src/components/ProgressBar.tsx` — ASCII fill bar (`█░`) colored by status, shows `completed/total  pct%`
- [x] 8.2 Create `src/components/TaskItem.tsx` — `✓`/`○` prefix, task number, label truncated to panel width
- [x] 8.3 Create `src/components/ChangeList.tsx` — grouped sections with headers, status-colored bullets, selected row with `▶` and cyan, ARCHIVED collapses when `archivedOpen=false`
- [x] 8.4 Create `src/components/ChangeDetail.tsx` — name + status badge, ProgressBar, task list, artifacts footer
- [x] 8.5 Create `src/components/KeyHints.tsx` — single-line hint bar at the bottom

## App

- [x] 8.6 Rewrite `src/App.tsx` — flat list navigation skipping headers, `↑↓/jk` movement, `a` toggles archived, `q`/Esc quits

## Dev ergonomics

- [x] 8.7 Add `tsx` as devDependency to `packages/tui/package.json`
- [x] 8.8 Create `src/dev.tsx` — reads filesystem via `@harness/parser` + `loadConfig`, renders App without HTTP server
- [x] 8.9 Add `"start": "node --import tsx/esm src/dev.tsx"` script to `packages/tui/package.json`

## Verification

- [x] 8.10 Run `pnpm --filter @harness/tui build` and confirm no TypeScript errors
- [x] 8.11 Run `pnpm --filter @harness/tui start` from `../titico` and confirm grouped list, progress bar, navigation, and quit with `q`
