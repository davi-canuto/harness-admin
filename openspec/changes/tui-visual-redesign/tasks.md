# Tasks: TUI Visual Redesign

## Components

- [ ] 8.1 Create `src/components/ProgressBar.tsx` — ASCII fill bar (`█░`) colored by status, shows `completed/total  pct%`
- [ ] 8.2 Create `src/components/TaskItem.tsx` — `✓`/`○` prefix, task number, label truncated to panel width
- [ ] 8.3 Create `src/components/ChangeList.tsx` — grouped sections with headers, status-colored bullets, selected row with `▶` and cyan, ARCHIVED collapses when `archivedOpen=false`
- [ ] 8.4 Create `src/components/ChangeDetail.tsx` — name + status badge, ProgressBar, task list, artifacts footer
- [ ] 8.5 Create `src/components/KeyHints.tsx` — single-line hint bar at the bottom

## App

- [ ] 8.6 Rewrite `src/App.tsx` — flat list navigation skipping headers, `↑↓/jk` movement, `a` toggles archived, `q`/Esc quits

## Dev ergonomics

- [ ] 8.7 Add `tsx` as devDependency to `packages/tui/package.json`
- [ ] 8.8 Create `src/dev.tsx` — reads filesystem via `@harness/parser` + `loadConfig`, renders App without HTTP server
- [ ] 8.9 Add `"start": "node --import tsx/esm src/dev.tsx"` script to `packages/tui/package.json`

## Verification

- [ ] 8.10 Run `pnpm --filter @harness/tui build` and confirm no TypeScript errors
- [ ] 8.11 Run `pnpm --filter @harness/tui start` from `../titico` and confirm grouped list, progress bar, navigation, and quit with `q`
