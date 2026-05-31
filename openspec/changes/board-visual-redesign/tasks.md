# Tasks: Board Visual Redesign

## Icons

- [ ] 7.1 Create `src/components/icons.tsx` with `PlayIcon`, `ClockIcon`, `CheckIcon`, `ArchiveIcon`, `InboxIcon`, `ChevronIcon` as inline SVG components

## StatCard

- [ ] 7.2 Create `src/components/StatCard.tsx` — count + icon + label card for the sidebar header strip

## ProgressBar

- [ ] 7.3 Update `src/components/ProgressBar.tsx` — increase height to `h-3`, accept `inProgress` prop, add blue glow on active fills

## Sidebar

- [ ] 7.4 Rewrite `src/components/Sidebar.tsx` — stat card strip at top, grouped sections by status with headers, collapsible ARCHIVED section, accent-border selected row, no name truncation

## ChangeDetail

- [ ] 7.5 Rewrite `src/components/ChangeDetail.tsx` — larger heading, progress fraction inline with percentage, pass `inProgress` to ProgressBar, pill-style artifact badges with strikethrough when absent

## TaskList

- [ ] 7.6 Rewrite `src/components/TaskList.tsx` — row number column, checkbox icon, relaxed line-height, strikethrough on completed tasks

## EmptyState

- [ ] 7.7 Create `src/components/EmptyState.tsx` — radial gradient background, inbox icon, subtitle with live counts
- [ ] 7.8 Update `src/App.tsx` to render `EmptyState` with counts when no change is selected

## Verification

- [ ] 7.9 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors
- [ ] 7.10 Screenshot the board with titico project loaded and confirm: stat cards visible, grouped sections, detail panel readable, empty state styled
