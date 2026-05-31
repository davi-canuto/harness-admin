# Proposal: Parser Package

## Problem

Every other package in Harness Admin needs to read SDD project directories, parse `tasks.md` files, and determine the status of each change. This logic must live in one place — not duplicated across the server, CLI, and TUI.

## Proposed Solution

Create `packages/parser` (`@harness/parser`) as the shared core library:

- **Types** — canonical TypeScript interfaces: `Change`, `Task`, `Status`, `Config`, `WatcherEvent`
- **Parser** — extracts `[ ]` / `[x]` task items from a `tasks.md` file using regex
- **Classifier** — determines status (`backlog`, `in_progress`, `done`, `archived`) from task state and path
- **Reader** — recursively scans the `changesDir`, assembles `Change` objects
- **Watcher** — wraps chokidar, diffs the change list on every file system event, emits typed `WatcherEvent`s

## Constraints

- No database, no network — reads the file system only
- Must support the archive subdirectory pattern (a change is `archived` when its path starts with `archiveDir`)
- Pure ESM, Node.js only
