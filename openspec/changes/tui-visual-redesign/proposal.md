# Proposal: TUI Visual Redesign

## Current State

Observed from a live session against titico (58 changes):

1. **Flat unordered list** — all 58 changes in a single scrollable column, no grouping by status; the user has to hunt for what's in progress
2. **Names wrap mid-word and break across rows** — `admin-booking-ma` / `nagement` — the sidebar is 30 chars wide and Ink wraps arbitrarily, making names unreadable
3. **No status context in the list** — every row looks identical; the only difference is the `>` cursor marker; there's no color or symbol communicating status at a glance
4. **Status line is a raw string** — `Status: done  22/22 tasks (100%)` — visually indistinguishable from any other line; no color accent
5. **Progress is not visual** — percentage is just a number; no bar or fill
6. **No keyboard help** — user has no indication of available keys (`j/k` or arrows, `q` to quit, `tab` to switch focus)
7. **No `dev` script** — running the TUI requires the server to be up and manually calling `startTUI()` — there's no `pnpm --filter @harness/tui dev` that reads from the filesystem directly
8. **No `q` to quit** — there is no exit keybind; the user has to `Ctrl-C`

## Proposed Solution

Redesign the TUI in four areas: **list panel**, **detail panel**, **keybindings**, and **dev ergonomics**.

### List panel

- Group changes by status with section headers, matching the board's logic: `IN PROGRESS`, `BACKLOG`, `DONE`, `ARCHIVED`
- Each section header shows count: `── IN PROGRESS (3) ──`
- Each row: status-colored bullet (`●`) + name on a single line, truncated to panel width with `…` (not mid-word wrap)
- Selected row: bold, colored (cyan), `▶` prefix
- `ARCHIVED` section collapses to header-only by default; `a` key toggles it

### Detail panel

- Change name in bold + status badge (`[ in progress ]`) on the same line
- Progress bar rendered in ASCII: `████████░░░░  13/18  72%` — fill with `█`, empty with `░`, colored by status
- Task list: `  ✓ 1.` / `  ○ 1.` prefix with task number, label truncated to panel width
- Artifacts footer: `proposal.md  design.md  tasks.md` — dimmed when absent

### Keybindings

| Key | Action |
|---|---|
| `↑` / `k` | move cursor up |
| `↓` / `j` | move cursor down |
| `a` | toggle ARCHIVED section |
| `q` / `Esc` | quit |

Key hint bar at the bottom: `↑↓/jk move · a toggle archived · q quit`

### Dev ergonomics

Add a `start` script to `packages/tui/package.json` that reads directly from the filesystem (via `@harness/parser`) without needing the HTTP server, defaulting to `process.cwd()` with the standard config. This lets `pnpm --filter @harness/tui start` work from any project root.

## Out of Scope

- Mouse support
- Live WebSocket updates in the TUI (post-MVP)
- Color themes
