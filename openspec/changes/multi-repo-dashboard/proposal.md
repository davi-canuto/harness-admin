# Proposal: Multi-Repo Dashboard

## Problem

Developers often work across multiple projects simultaneously. Each one has its own `changes/` directory, but Harness only shows one project at a time — the one you started it from. Switching between projects means stopping the server, navigating to a different directory, and restarting.

For someone maintaining 3–5 active projects, this makes Harness nearly useless as a daily driver. You can't get a consolidated view of what's in progress across everything.

## Proposed Solution

Allow `harness.config.json` to declare multiple project roots. The board shows a project switcher in the sidebar header and can display changes from all projects simultaneously in a consolidated view.

### Configuration

```json
{
  "projects": [
    { "name": "titico",   "path": "/home/user/projects/titico" },
    { "name": "harness",  "path": "/home/user/projects/harness-admin" },
    { "name": "api",      "path": "/home/user/projects/my-api" }
  ],
  "port": 3000
}
```

Single-project usage (current behavior) remains the default — `projects` is optional and falls back to `{ "path": process.cwd() }`.

### Modes

**Project switcher (default):** A dropdown in the sidebar header lets the user switch between projects. Only one project's changes are shown at a time. Fast, familiar.

**Consolidated view (toggle):** A "All projects" option in the switcher merges all changes into one list. Each change row shows a project badge (`titico`, `harness`, etc.) to identify origin. Sections group by status across all projects.

### Server

- The watcher is instantiated once per project
- `/api/changes` accepts an optional `?project=name` query param; without it, returns changes from the default/active project
- `/api/changes/all` returns all changes across all projects with a `project` field added to each `Change`
- WebSocket broadcasts from all watchers; events include a `project` field

### Sidebar

- Header area shows current project name + dropdown arrow
- Dropdown lists all configured projects + "All projects" option
- Selecting a project updates the displayed changes instantly (no reload)

## Out of Scope

- Adding/removing projects at runtime without editing the config file
- Per-project authentication or access control
- Relative paths in config (paths must be absolute)
