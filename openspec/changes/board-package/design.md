# Design: Board Package (Browser UI)

## Package Identity

```
name: @harness/board (scoped name reused by the CLI for npm publishing)
build: Vite SPA → dist/
dev server: port 5173, proxies /api and /ws to localhost:3000
```

## Component Tree

```
App
├── Sidebar
│   ├── metrics (counts per status)
│   └── list of Change buttons → StatusBadge
└── ChangeDetail
    ├── StatusBadge
    ├── ProgressBar
    ├── TaskList → Task items (✓ / ○)
    └── artifact badges (proposal.md, design.md, tasks.md)
```

## Data Flow

`useChanges` hook:
1. Opens `WebSocket` to `/ws`
2. On `snapshot` message → replaces entire change list (reducer)
3. On `change_added` / `change_updated` / `change_removed` → patches the list
4. On close → schedules reconnect after 2 s
5. Returns `{ changes, loading, error }`

## Types (`src/types.ts`)

Mirror of `@harness/parser` types — inlined to avoid a runtime dependency on a Node.js package in the browser bundle.

## Styling

- Dark theme: `bg-zinc-900` / `bg-zinc-950` base
- Status colors: `backlog` → zinc, `in_progress` → blue, `done` → green, `archived` → zinc muted
- No Tailwind component plugins — utility classes only

## Vite Config

```ts
server: {
  proxy: {
    "/api": "http://localhost:3000",
    "/ws": { target: "ws://localhost:3000", ws: true }
  }
}
```
