# Proposal: Archive Action

## Problem

Archiving a change today requires leaving the board, going to the terminal, and running the CLI manually — or manually moving the directory in the filesystem. This breaks the flow of a developer who is using the board to review their work. The board is read-only, which makes it a passive viewer rather than an active tool.

## Proposed Solution

Add an **Archive** button to the `ChangeDetail` panel. Clicking it moves the change directory from `changesDir` to `archiveDir` on the server side and reflects the update in real time via WebSocket.

### UI

- An "Archive" button appears in the detail panel footer, visible only for changes with `status !== "archived"`
- Button style: secondary/destructive — zinc outlined, hover turns amber to signal it's a write action
- Clicking shows an inline confirmation: `Archive "change-name"? This moves it to archive/.` with **Confirm** and **Cancel**
- On confirm: POST `/api/changes/:id/archive` — the watcher detects the filesystem change and pushes a `change_updated` event automatically

### API

New route: `POST /api/changes/:id/archive`

- Looks up the change by `id` from the watcher's cache
- Verifies the change is not already archived
- Moves `change.path` → `join(archiveDir, change.name)` using `fs.rename`
- Returns `{ ok: true }` — the watcher handles the broadcast

### Error states

- Change already archived → 400 with message
- Target path already exists → 409 with message (a change with the same name was already archived)
- Filesystem error → 500

## Out of Scope

- Unarchive (restore) action — separate change
- Bulk archive
- Archive from the TUI
