# Harness

**A local dashboard for Specification-Driven Development projects.**

Harness reads your `changes/` directory and gives you a real-time view of every spec in flight — what's in progress, what's backlog, what's done. No database, no cloud, no config required.

```
npx harness
```

---

## What it looks like

### Browser (default)

> Sidebar grouped by status · progress fractions · live WebSocket updates · resizable panel

![Harness board](docs/board.png)

### Terminal (`--tui`)

```
 HARNESS                      ┌───────────────────────────────────────────────┐
                              │  community-youtube-videos  [ in progress ]     │
 ── IN PROGRESS (3) ──        │                                                │
 ▶ community-youtube-videos   │  █████████████████████░░░░░░  13/18  72%      │
   landing-page               │                                                │
   openpix-pix-payment        │  Tasks                                         │
                              │  ✓  1. 1.1 Create youtube.ts lib               │
 ── BACKLOG (3) ──            │  ✓  2. 1.2 YouTubeVideo type                   │
   content-recommendations    │  ✓  3. 1.3 Read env vars                       │
   purchase-confirmation      │  ○  4. 3.2 Document .env.example               │
   stripe-connect             │  ○  5. 4.1 Configure API key in staging        │
                              │                                                │
 ── DONE (28) ──              │  proposal.md  design.md  tasks.md              │
   admin-booking-management   │                                                │
   ...                        └───────────────────────────────────────────────┘
                              ┌───────────────────────────────────────────────┐
 ── ARCHIVED (24) ▸           │  ↑↓/jk move · a toggle archived · q quit      │
                              └───────────────────────────────────────────────┘
```

---

## Installation

**Run without installing (recommended):**

```bash
npx harness
```

**Or install globally:**

```bash
npm install -g harness
harness
```

**Or as a dev dependency:**

```bash
npm install -D harness
```

Then add to `package.json`:

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
# Open browser dashboard (default)
harness

# Open terminal UI
harness --tui

# Point to a different project root
harness /path/to/project

# Use a custom config file
harness --config ./my-harness.config.json
```

When you run `harness`, it prints the URL and opens your browser:

```
  harness  http://localhost:3000
```

With `--tui`, it stays in the terminal:

```
  harness  running at http://localhost:3000

  [TUI launches]
```

---

## How it works

Harness scans `openspec/changes/` (configurable) for subdirectories. Each subdirectory is a **change** — a unit of work tracked by markdown files. Harness derives its status from the `tasks.md` file:

| Status | Condition |
|---|---|
| `in progress` | at least one `[x]` and at least one `[ ]` |
| `done` | all tasks marked `[x]` |
| `backlog` | no `tasks.md`, or zero checked tasks |
| `archived` | lives inside the archive directory |

Changes are watched in real time via `chokidar`. The browser board updates over WebSocket — no refresh needed.

---

## Convention

Harness works with **any project** that follows this directory shape:

```
your-project/
└── openspec/
    └── changes/
        ├── feature-name/
        │   ├── proposal.md
        │   ├── design.md
        │   └── tasks.md        ← checked with [x] / [ ]
        └── archive/
            └── finished-feature/
                └── tasks.md
```

No framework required. Works with [OpenSpec](https://github.com/your-org/openspec), manual SDD workflows, or any convention that follows this shape.

---

## Configuration

Harness works with zero config for OpenSpec projects. To customize, create `harness.config.json` at your project root:

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

All fields are optional — defaults shown above.

---

## Monorepo

```
packages/
├── parser/   Core: reads filesystem, parses tasks.md, classifies status, watches for changes
├── server/   Local Fastify server — GET /api/changes, WebSocket /ws
├── board/    Browser SPA — Vite + React + Tailwind
├── tui/      Terminal UI — Ink + React
└── cli/      npx entry point — wires everything together
```

---

## Roadmap

- [ ] **Archive action** — archive a change directly from the board
- [ ] **Claude integration** — chat with context of `proposal.md` + `design.md` + `tasks.md` pre-loaded
- [ ] **Apply by task** — delegate a specific task to Claude from the UI
- [ ] **Multi-repo** — point to multiple projects, consolidated dashboard
- [ ] **SDD actions in UI** — `/propose`, `/apply`, `/archive` without leaving the browser

---

## Contributing

```bash
git clone https://github.com/your-org/harness
cd harness
pnpm install
pnpm build
```

To run against a local SDD project:

```bash
# Start the server pointing at your project
cd /path/to/your-project
node /path/to/harness/packages/cli/dist/index.js

# Or run the board dev server + server separately
pnpm --filter @harness/server dev
pnpm --filter @harness/board dev
```

Every feature goes through an OpenSpec change (`openspec/changes/`). See `AGENTS.md` for the workflow.

---

## License

MIT
