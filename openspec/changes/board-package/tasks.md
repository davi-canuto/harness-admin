# Tasks: Board Package (Browser UI)

- [x] 4.1 Create `packages/board/package.json` with Vite, React, Tailwind dependencies
- [x] 4.2 Create `packages/board/tsconfig.json` for browser (bundler moduleResolution, jsx react-jsx)
- [x] 4.3 Create `packages/board/vite.config.ts` with proxy rules for `/api` and `/ws`
- [x] 4.4 Create `packages/board/tailwind.config.js` and `postcss.config.js`
- [x] 4.5 Create `index.html` and `src/main.tsx` entry point
- [x] 4.6 Create `src/index.css` with Tailwind directives
- [x] 4.7 Create `src/types.ts` — inlined Change/Task/Status types for the browser
- [x] 4.8 Implement `src/hooks/useChanges.ts` — WebSocket reducer with reconnect logic
- [x] 4.9 Implement `src/components/StatusBadge.tsx`
- [x] 4.10 Implement `src/components/ProgressBar.tsx`
- [x] 4.11 Implement `src/components/TaskList.tsx`
- [x] 4.12 Implement `src/components/ChangeDetail.tsx`
- [x] 4.13 Implement `src/components/Sidebar.tsx` — metrics + sorted change list
- [x] 4.14 Implement `src/App.tsx` — split-view layout wiring Sidebar and ChangeDetail
- [x] 4.15 Run `pnpm --filter @harness/board build` and confirm clean production build
