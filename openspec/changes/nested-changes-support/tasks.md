# Tasks: Nested Changes Support

## Parser

- [ ] 9.1 Update `packages/parser/src/types.ts` — add `children?: Change[]` and `isChild?: boolean` to the `Change` interface
- [ ] 9.2 Update `packages/parser/src/reader.ts` — scan two levels deep; treat a directory as a parent when it has no `tasks.md` but its children do; aggregate `totalTasks`, `completedTasks`, `progress` from children; pass synthetic task array to `classifyStatus`
- [ ] 9.3 Run `pnpm --filter @harness/parser build` and confirm no TypeScript errors

## Board

- [ ] 9.4 Update `packages/board/src/types.ts` — mirror `children?` and `isChild?` fields
- [ ] 9.5 Update `packages/board/src/components/Sidebar.tsx` — render parent rows with expand/collapse chevron and indented child rows (`pl-8`); parents expand by default when `status === "in_progress"`
- [ ] 9.6 Create `packages/board/src/components/ParentDetail.tsx` — aggregated progress bar + sub-change cards with individual mini bars and a button to select each child
- [ ] 9.7 Update `packages/board/src/components/ChangeDetail.tsx` — branch to `ParentDetail` when `change.children` exists; thread `onSelectChild` from App
- [ ] 9.8 Update `packages/board/src/App.tsx` — pass `onSelect` down to `ChangeDetail`
- [ ] 9.9 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## TUI

- [ ] 9.10 Update `packages/tui/src/types.ts` — mirror `children?` and `isChild?` fields
- [ ] 9.11 Update `packages/tui/src/components/ChangeList.tsx` — render children indented under their parent row
- [ ] 9.12 Update `packages/tui/src/App.tsx` — flatten children into `navList` as individual navigable items; skip parent rows from navigation

## Verification

- [ ] 9.13 Create a fixture project with a nested change structure (parent + 2 sub-changes) and confirm: parent shows aggregated progress, children visible in sidebar, clicking a child shows its task list
- [ ] 9.14 Confirm existing flat changes still work correctly — no regression
- [ ] 9.15 Run `pnpm build` across all packages
