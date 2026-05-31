# Proposal: SDD Actions in UI

## Problem

The full SDD workflow has three commands: `/propose`, `/apply`, and `/archive`. Today Harness implements `/archive` (via the archive-action change) and `/apply` per-task (via apply-by-task). But `/propose` — creating a new change with `proposal.md`, `design.md`, and `tasks.md` — still requires leaving the board and running the CLI manually.

Additionally, there is no way to create a new change from the board at all. The board is still a viewer with limited write capabilities.

## Proposed Solution

Add a **New Change** button to the sidebar that walks the developer through creating a new OpenSpec change without leaving the board. The flow uses Claude to generate the `proposal.md` and `design.md` from a short description, then lets the developer review and edit them before confirming.

### Flow

1. Developer clicks **+ New Change** in the sidebar header
2. A modal opens with a single input: `What are you building?`
3. Developer types a short description (e.g. `"email notifications for new purchases"`)
4. Board calls `POST /api/changes/propose` with `{ name, description }`
5. Server calls Claude API to generate:
   - A slug for the directory name (kebab-case, max 40 chars)
   - `proposal.md` content (problem + proposed solution)
   - `design.md` content (technical design)
   - Skeleton `tasks.md` (3–5 starter tasks as `[ ]`)
6. Modal shows a preview of the three files with inline editing
7. Developer edits, then clicks **Create Change**
8. Server writes the files to `changesDir/<slug>/`
9. Watcher picks up the new directory, board updates in real time

### UI — New Change modal

```
┌──────────────────────────────────────────┐
│  New Change                              │
│                                          │
│  Name  [email-notifications-purchases  ] │
│                                          │
│  proposal.md  ──────────────────────     │
│  [editable textarea]                     │
│                                          │
│  design.md  ────────────────────────     │
│  [editable textarea]                     │
│                                          │
│  tasks.md  ─────────────────────────     │
│  [editable textarea]                     │
│                                          │
│             [Cancel]  [Create Change]    │
└──────────────────────────────────────────┘
```

While Claude is generating: show a spinner per file as each streams in.

### Server

New route: `POST /api/changes/propose`

Request: `{ description: string }`

Response (streaming SSE):
```
event: proposal  data: <markdown>
event: design    data: <markdown>
event: tasks     data: <markdown>
event: done      data: { slug }
```

New route: `POST /api/changes/create`

Request: `{ slug, proposal, design, tasks }`
- Creates `changesDir/<slug>/` directory
- Writes the three files
- Returns `{ ok: true, id: slug }`

### Requirements

- `ANTHROPIC_API_KEY` must be set (same as Claude integration)
- If not set, the **+ New Change** button is disabled with tooltip: `Set ANTHROPIC_API_KEY to use this feature`

## Out of Scope

- Editing existing `proposal.md` or `design.md` from the board
- Template support (custom prompt templates per project)
- Generating tasks from the design automatically beyond the initial skeleton
