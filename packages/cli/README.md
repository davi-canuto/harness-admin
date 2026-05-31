# harness-admin

A local dashboard for Specification-Driven Development projects.

Reads your `changes/` directory and shows every spec grouped by status — in progress, backlog, done, archived — with task-level progress updated in real time.

## Quick Start

```bash
cd your-project
npx harness-admin
```

Opens the board at `http://localhost:3000`. Your browser opens automatically.

## Usage

```bash
npx harness-admin                              # browser dashboard (default)
npx harness-admin --tui                        # terminal UI
npx harness-admin -p 3001                      # custom port
npx harness-admin --config ./harness.config.json
```

## Requirements

Node.js 18+

## Configuration

Create `harness.config.json` at your project root to customize paths and port. All fields are optional:

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

## Directory convention

```
your-project/
└── openspec/
    └── changes/
        ├── my-feature/
        │   └── tasks.md     ← [ ] / [x] checklist
        └── archive/
            └── shipped/
                └── tasks.md
```

Works with any project that follows this shape — no framework required.

## Full documentation

[github.com/davi-canuto/harness-admin](https://github.com/davi-canuto/harness-admin)
