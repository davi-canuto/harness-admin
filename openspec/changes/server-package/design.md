# Design: Server Package

## Package Identity

```
name: @harness/server
type: module (pure ESM)
build: tsup → dist/index.js (no DTS needed — not imported as a library by non-workspace packages)
```

## Startup Flow (`src/index.ts`)

```
startServer(rootDir, config)
  1. Create eventListeners array
  2. createWatcher(rootDir, config, event → broadcast to listeners)
  3. Create Fastify instance
  4. Register @fastify/websocket plugin
  5. Add CORS hook (Access-Control-Allow-Origin: *)
  6. Register REST routes
  7. Register WebSocket route + wire event fan-out
  8. app.listen({ port: config.port, host: "127.0.0.1" })
```

## REST Routes (`src/routes.ts`)

| Method | Path | Response |
|--------|------|----------|
| GET | `/api/changes` | `Change[]` |
| GET | `/api/changes/:id` | `Change` or `404 { error }` |

## WebSocket (`src/ws.ts`)

- Route: `GET /ws` with `{ websocket: true }`
- On connect: sends `{ type: "snapshot", changes: watcher.getAll() }` immediately
- On watcher event: broadcasts JSON payload to all clients with `readyState === 1`
- On close: removes client from the set

## Dependencies

- `fastify` — HTTP server
- `@fastify/websocket` — WebSocket plugin for Fastify
- `@harness/parser` (workspace) — watcher and types
- `@types/node` (dev) — Node.js built-ins
