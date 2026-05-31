# harness-admin

A local dashboard for Specification-Driven Development projects.

Reads your `changes/` directory and shows every spec grouped by status — in progress, backlog, done, archived — with task-level progress, live updates, and archive actions.

## Quick Start

```bash
cd your-project
npx harness-admin
```

Opens at `http://localhost:3000`. Browser launches automatically.

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

Create `harness.config.json` at your project root. All fields optional:

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

### Multi-repo

```json
{
  "projects": [
    { "name": "frontend", "path": "/path/to/frontend" },
    { "name": "api",      "path": "/path/to/api" }
  ]
}
```

## Full documentation

[github.com/davi-canuto/harness-admin](https://github.com/davi-canuto/harness-admin)
