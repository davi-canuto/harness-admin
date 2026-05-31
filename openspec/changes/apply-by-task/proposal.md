# Proposal: Apply by Task

## Problem

The Claude integration (see `claude-integration`) allows open-ended chat about a change. But the most common workflow in SDD is more specific: the developer has a task like `2.3 Implement the refund route` and wants Claude to implement it — not just discuss it.

Today that requires copying the task text, switching to a terminal, running Claude Code, and pasting the context. It's a multi-step manual process every single time.

## Proposed Solution

Add a **Run** button next to each incomplete task in the task list. Clicking it delegates that specific task to Claude Code via `claude --print`, with the full spec context pre-loaded, and streams the output back to the board.

### UI

- Each `○` (incomplete) task row shows a small `▶ Run` button on hover
- Clicking `▶ Run` opens a slide-in terminal panel at the bottom of the detail view
- The panel shows a live stream of Claude's output (stdout)
- A **Stop** button aborts the process
- On completion, the panel shows exit status and a **Close** button

### Server

New endpoint: `POST /api/changes/:id/apply`

Request body:
```json
{ "taskId": "3" }
```

1. Look up the change and the specific task by index
2. Read `proposal.md`, `design.md`, `tasks.md`
3. Build a prompt:
   ```
   You are implementing task ${index} from the SDD change "${name}":

   Task: ${task.label}

   Context:
   [proposal.md contents]
   [design.md contents]
   [tasks.md contents]

   Implement this task in the project at ${rootDir}.
   ```
4. Spawn `claude --print "<prompt>"` as a child process in `rootDir`
5. Stream stdout/stderr back to the client via SSE
6. On exit, send `{ done: true, exitCode }`

### Requirements

- `claude` CLI must be installed and available in PATH
- If not found, the Run button is disabled with a tooltip: `Install Claude Code to use this feature`

### Safety

- Only one apply process runs at a time per change (subsequent clicks are disabled while running)
- Process is killed on server shutdown

## Out of Scope

- Auto-checking the task `[x]` after completion (the developer reviews and checks manually)
- Running multiple tasks simultaneously
- Editing the generated code from within the board
