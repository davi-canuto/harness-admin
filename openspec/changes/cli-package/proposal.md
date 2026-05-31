# Proposal: CLI Package (Entry Point)

## Problem

Users need a single command to start Harness Admin — it should spin up the local server, load the config, and open the appropriate UI (browser or terminal) without any manual steps.

The package published to npm must be runnable via `npx @harness/board` with zero configuration for projects that follow the OpenSpec convention.

## Proposed Solution

Create `packages/cli` (`@harness/board` on npm) — the entry point that:

- Parses `--tui` and `--config <path>` CLI flags from `process.argv`
- Loads `harness.config.json` from the current working directory (or the path provided by `--config`), falling back to built-in defaults
- Starts the Fastify server via `@harness/server`
- In browser mode (default): opens `http://localhost:<port>` with the `open` package
- In TUI mode (`--tui`): calls `startTUI` from `@harness/tui`

## Constraints

- The `bin` field points to `dist/index.js` (built by tsup with a `#!/usr/bin/env node` banner)
- Config loading is fault-tolerant: invalid JSON falls back to defaults with a warning
- No positional arguments in MVP — only named flags
