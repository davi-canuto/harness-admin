# harness-admin

[![npm](https://img.shields.io/npm/v/harness-admin?color=3b82f6&label=npm)](https://www.npmjs.com/package/harness-admin)
[![license](https://img.shields.io/npm/l/harness-admin?color=22d3ee)](LICENSE)
[![node](https://img.shields.io/node/v/harness-admin?color=4ade80&label=node)](https://nodejs.org)

A local dashboard for Specification-Driven Development projects.

---

## Quick Start

```bash
cd your-project
npx harness-admin
```

Opens the board at `http://localhost:3000`. Your browser opens automatically.

```bash
npx harness-admin --tui    # stay in the terminal
npx harness-admin -p 3001  # use a different port
```

**Requires Node.js 18+**

---

## Why Harness

You have 20 specs in flight. Some are done, some are stuck in backlog, a few are actively being worked on — but to know which is which you have to open each directory and read through the files.

Harness reads your `changes/` directory and gives you a real-time visual of every spec: grouped by status, with task-level progress, updated live as you work.

---

## Screenshots

### Browser

![Harness demo](docs/demo.gif)

![Harness board](docs/board.png)

*Sidebar grouped by status · resizable panel · task-level progress · live updates over WebSocket*

### Terminal

```
 HARNESS                      ┌────────────────────────────────────────────────┐
                              │  community-youtube-videos  [ in progress ]      │
 ── IN PROGRESS (3) ──        │                                                 │
 ▶ community-youtube-videos   │  █████████████████████░░░░░░  13/18  72%       │
   landing-page               │                                                 │
   openpix-pix-payment        │  Tasks                                          │
                              │   ✓  1. Create youtube.ts with fetch helper     │
 ── BACKLOG (3) ──            │   ✓  2. Define YouTubeVideo type                │
   content-recommendations    │   ✓  3. Read env vars                           │
   purchase-confirmation      │   ○  4. Document variables in .env.example      │
   stripe-connect             │   ○  5. Configure API key in staging            │
                              │                                                 │
 ── DONE (28) ──              │  proposal.md  design.md  tasks.md               │
   admin-booking-management   │                                                 │
   ...                        └─────────────────────────────────────────────────┘
                              ┌─────────────────────────────────────────────────┐
 ── ARCHIVED (24) ▸           │  ↑↓/jk move · a toggle archived · q quit        │
                              └─────────────────────────────────────────────────┘
```

*Grouped sections · ASCII progress bar · keyboard navigation · no server required*

---

## Installation

**Run without installing:**

```bash
npx harness-admin
```

**Install globally:**

```bash
npm install -g harness-admin
harness
```

**Install as a dev dependency:**

```bash
npm install -D harness-admin
```

```json
{
  "scripts": {
    "board": "harness"
  }
}
```

---

## Usage

```bash
harness                                    # browser dashboard (default)
harness --tui                              # terminal UI
harness -p 3001                            # custom port
harness --config ./harness.config.json     # custom config file
```

---

## How it works

Harness scans `openspec/changes/` for subdirectories. Each subdirectory is a **change** — a unit of work with a `tasks.md` checklist. Status is derived automatically:

| Status | Condition |
|---|---|
| `in progress` | at least one `[x]` and at least one `[ ]` task |
| `done` | every task marked `[x]` |
| `backlog` | no `tasks.md`, or no tasks checked yet |
| `archived` | lives inside the archive directory |

The file system is the source of truth. Harness watches it with `chokidar` and pushes updates to the browser over WebSocket — no manual refresh needed.

---

## Directory convention

Harness works with any project that follows this shape:

```
your-project/
└── openspec/
    └── changes/
        ├── my-feature/
        │   ├── proposal.md   ← what and why
        │   ├── design.md     ← how
        │   └── tasks.md      ← [ ] / [x] checklist
        └── archive/
            └── shipped-feature/
                └── tasks.md
```

No framework required. Works with [OpenSpec](https://github.com/davi-canuto/openspec), hand-rolled SDD workflows, or anything that follows this layout.

**Nested changes** are also supported — a parent directory without its own `tasks.md` but with sub-directories that have one becomes a grouped entry with aggregated progress.

---

## Configuration

Zero config needed for OpenSpec projects. To customize, create `harness.config.json` at your project root:

```json
{
  "changesDir": "openspec/changes",
  "archiveDir": "openspec/changes/archive",
  "tasksFile": "tasks.md",
  "proposalFile": "proposal.md",
  "designFile": "design.md",
  "port": 3000
}
```

All fields are optional — the values above are the defaults.

---

## Package structure

```
packages/
├── parser/   Reads the filesystem, parses tasks.md, classifies status, watches for changes
├── server/   Local Fastify server — GET /api/changes, WebSocket /ws, serves the board SPA
├── board/    Browser dashboard — Vite + React + Tailwind CSS
├── tui/      Terminal UI — Ink + React, reads filesystem directly
└── cli/      Entry point published to npm — wires everything together
```

---

## Roadmap

- [ ] **Archive action** — archive a change directly from the board without touching the CLI
- [ ] **Claude integration** — open a chat with `proposal.md` + `design.md` + `tasks.md` pre-loaded as context
- [ ] **Apply by task** — delegate a specific task to Claude from the UI
- [ ] **Multi-repo dashboard** — point to multiple projects and see a consolidated view
- [ ] **SDD actions in UI** — run `/propose`, `/apply`, `/archive` without leaving the browser

---

## Contributing

```bash
git clone https://github.com/davi-canuto/harness-admin
cd harness-admin
pnpm install
pnpm build
```

To develop against a local project:

```bash
# Terminal 1 — start the API server pointing at your project
cd /path/to/your-project
node /path/to/harness-admin/packages/cli/dist/index.js

# Terminal 2 — start the board dev server with hot reload
cd /path/to/harness-admin/packages/board
pnpm dev
```

Every change to Harness itself goes through an OpenSpec change in `openspec/changes/`. See `AGENTS.md` for the workflow.

---

## License

MIT
