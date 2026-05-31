# Tasks: CLI Package (Entry Point)

- [x] 6.1 Create `packages/cli/package.json` — `name: @harness/board`, bin field, dependencies
- [x] 6.2 Create `packages/cli/tsconfig.json` extending `tsconfig.base.json`
- [x] 6.3 Create `packages/cli/tsup.config.ts` with shebang banner and external workspace deps
- [x] 6.4 Implement `src/config.ts` — `loadConfig()` with JSON parsing and defaults fallback
- [x] 6.5 Implement `src/index.ts` — argv parsing, server startup, browser/TUI dispatch
- [x] 6.6 Run `pnpm --filter @harness/board build` (cli) and confirm clean output
- [x] 6.7 Run full `pnpm build` across all packages and confirm all succeed
