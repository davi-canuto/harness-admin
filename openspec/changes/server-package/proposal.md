# Proposal: Server Package

## Problem

The browser board and the TUI both need access to the parsed change data. They cannot read the file system directly (the board runs in a browser, and the TUI may run in a separate process). A local HTTP server is needed to bridge the parser and the UI layers.

Real-time updates are also required: when a `tasks.md` file changes on disk, the UI should reflect it immediately without a full page reload.

## Proposed Solution

Create `packages/server` (`@harness/server`) — a lightweight Fastify server that:

- Exposes `GET /api/changes` returning all changes as JSON
- Exposes `GET /api/changes/:id` returning a single change
- Exposes `GET /ws` as a WebSocket endpoint that pushes `WatcherEvent` objects to connected clients
- Adds permissive CORS headers so the Vite dev server (port 5173) can reach the API (port 3000)
- Starts the `@harness/parser` watcher internally and fans out events to all connected WebSocket clients

## Constraints

- Binds to `127.0.0.1` only — not exposed on the network
- Single-process: server + watcher run together
- No auth, no persistence
