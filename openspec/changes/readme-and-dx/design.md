# Design: README and DX Improvements

## Badges (`README.md` top)

```markdown
[![npm](https://img.shields.io/npm/v/harness-admin?color=3b82f6&label=npm)](https://www.npmjs.com/package/harness-admin)
[![license](https://img.shields.io/npm/l/harness-admin?color=22d3ee)](LICENSE)
[![node](https://img.shields.io/node/v/harness-admin?color=4ade80&label=node)](https://nodejs.org)
```

Blue for version, cyan for license, green for node — matches the board's color palette.

---

## Demo GIF (`docs/demo.gif`)

Recorded with Playwright + `gif-encoder-2` (or equivalent). Script:

1. Navigate to `http://localhost:3000`
2. Wait for sidebar to load
3. Click the "Done" section header to collapse it (show the accordion)
4. Click an in-progress change
5. Scroll the task list slightly
6. Total duration: ~6-8 seconds, loop

Save to `docs/demo.gif`. Embed in README:

```markdown
![Harness demo](docs/demo.gif)
```

If GIF generation is too heavy/fragile, use a static screenshot sequence with captions instead — a before/after of sidebar collapsed and detail panel open is already better than nothing. **The GIF is best-effort.**

---

## Root README restructure

New section order:

```
# Harness
[badges]
[one-line description]

## Quick Start       ← NEW, moved to top
## Why Harness       ← NEW, replaces generic intro
## Screenshots / Demo
## Installation
## Usage
## How it works
## Directory convention
## Configuration
## Package structure
## Roadmap
## Contributing
## License
```

### Quick Start

```markdown
## Quick Start

```bash
cd your-project
npx harness-admin
```

Opens the board at `http://localhost:3000`. Your browser opens automatically.

```bash
npx harness-admin --tui   # stay in the terminal
npx harness-admin -p 3001 # use a different port
```

**Requires Node.js 18+**
```

### Why Harness

```markdown
## Why Harness

You have 20 specs in flight. Some are done, some are stuck in backlog, a few are actively being worked on — but to know which is which you have to open each directory and read through the files.

Harness reads your `changes/` directory and gives you a real-time visual of every spec: grouped by status, with task-level progress, updated live as you work.
```

---

## `packages/cli/package.json` — engines field

```json
"engines": {
  "node": ">=18"
}
```

---

## `packages/cli/README.md` (npm page)

Short, focused on getting started. Full content:

```markdown
# harness-admin

A local dashboard for Specification-Driven Development projects.

## Quick Start

```bash
npx harness-admin
```

Opens the board at `http://localhost:3000`.

## Usage

```bash
npx harness-admin              # browser dashboard
npx harness-admin --tui        # terminal UI
npx harness-admin -p 3001      # custom port
npx harness-admin --config ./harness.config.json
```

## Requirements

Node.js 18+

## Configuration

Create `harness.config.json` at your project root to customize paths and port:

```json
{
  "changesDir": "openspec/changes",
  "archiveDir": "openspec/changes/archive",
  "port": 3000
}
```

## Full documentation

[github.com/davi-canuto/harness-admin](https://github.com/davi-canuto/harness-admin)
```
