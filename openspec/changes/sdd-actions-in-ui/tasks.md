# Tasks: SDD Actions in UI

## Server
- [ ] 15.1 Add `POST /api/changes/propose` route — streams proposal.md, design.md, tasks.md generation via Claude SSE; sends `slug`, `proposal`, `design`, `tasks`, and `done` events
- [ ] 15.2 Add `POST /api/changes/create` route — writes the three files to `changesDir/<slug>/`, returns 409 if slug already exists
- [ ] 15.3 Run `pnpm --filter @harness/server build` and confirm no TypeScript errors

## Board
- [ ] 15.4 Add `PlusIcon` to `packages/board/src/components/icons.tsx`
- [ ] 15.5 Create `packages/board/src/hooks/usePropose.ts` — manages input → generating → review phase transitions, SSE parsing per file, create call
- [ ] 15.6 Create `packages/board/src/components/NewChangeModal.tsx` — three phases: input form, streaming preview panels, editable review with Create button
- [ ] 15.7 Update `Sidebar.tsx` — add `+ New Change` button in header, disabled with tooltip when `claudeAvailable === false`
- [ ] 15.8 Update `App.tsx` — manage modal open/close state, pass `onNewChange` to Sidebar
- [ ] 15.9 Run `pnpm --filter @harness/board build` and confirm no TypeScript errors

## Verification
- [ ] 15.10 With `ANTHROPIC_API_KEY` set, click `+ New Change`, type a description, click Generate — verify three panels stream in simultaneously
- [ ] 15.11 Edit the generated content in review phase, click Create Change — verify the new change appears in the sidebar's Backlog section
- [ ] 15.12 Without `ANTHROPIC_API_KEY`, verify the `+` button is disabled
- [ ] 15.13 Try to create a change with a slug that already exists — verify 409 error is shown
