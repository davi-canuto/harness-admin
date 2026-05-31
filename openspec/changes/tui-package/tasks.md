# Tasks: TUI Package (Terminal UI)

- [x] 5.1 Create `packages/tui/package.json` with Ink and React dependencies
- [x] 5.2 Create `packages/tui/tsconfig.json` extending `tsconfig.base.json` with `jsx: react-jsx`
- [x] 5.3 Create `packages/tui/tsup.config.ts` with JSX transform and Ink/React externals
- [x] 5.4 Create `src/types.ts` — inlined Change/Task/Status types
- [x] 5.5 Implement `src/App.tsx` — two-column Ink layout with arrow-key navigation
- [x] 5.6 Implement `src/index.tsx` — `startTUI(serverUrl)` fetching changes and rendering App
- [x] 5.7 Run `pnpm --filter @harness/tui build` and confirm clean output
