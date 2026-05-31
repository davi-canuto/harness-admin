# Tasks: Parser Package

- [x] 2.1 Create `packages/parser/package.json` with dependencies and build scripts
- [x] 2.2 Create `packages/parser/tsconfig.json` extending `tsconfig.base.json`
- [x] 2.3 Create `packages/parser/tsup.config.ts` targeting ESM with DTS output
- [x] 2.4 Implement `src/types.ts` — `Change`, `Task`, `Status`, `Config`, `WatcherEvent`
- [x] 2.5 Implement `src/parser.ts` — parse `[ ]` / `[x]` items from a markdown file
- [x] 2.6 Implement `src/classifier.ts` — derive status from path and task completion state
- [x] 2.7 Implement `src/reader.ts` — recursively scan `changesDir` and build `Change[]`
- [x] 2.8 Implement `src/watcher.ts` — chokidar watcher with diff-based event emission
- [x] 2.9 Create `src/index.ts` exporting all public symbols
- [x] 2.10 Run `pnpm --filter @harness/parser build` and confirm clean output
