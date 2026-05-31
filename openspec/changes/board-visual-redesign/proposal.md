# Proposal: Board Visual Redesign

## Current State

The board is functional but visually poor. Observed problems from a live session against a real project (titico, 58 changes):

1. **Sidebar names are truncated** — `community-youtube-…` loses meaning at a glance; the badge floats right with no alignment rhythm
2. **No grouping by status** — all changes are in a flat list sorted by status string; the user has to mentally group them
3. **Metrics are plain text** — `backlog 3 / in progress 3 / done 28 / archived 24` has no visual weight, looks like a label-value dump
4. **Detail panel is dense** — task labels run the full panel width with no breathing room; long labels wrap awkwardly; the progress bar is barely visible
5. **Empty state is dead space** — "Select a change" in the center of a 75% empty panel gives no guidance
6. **No visual hierarchy** — system font, all the same weight, same color intensity; nothing draws the eye

## Proposed Solution

Redesign the board UI in three areas: **sidebar**, **detail panel**, and **empty state**. No new data is fetched — this is a pure visual rework of existing components.

### Sidebar

- Group changes by status with sticky section headers (`IN PROGRESS`, `BACKLOG`, `DONE`, `ARCHIVED`)
- Each header shows the count inline: `IN PROGRESS  3`
- `ARCHIVED` section is collapsed by default; click header to expand
- Change rows: full name (no truncation — allow wrapping), progress fraction `13/18` right-aligned in muted text, no badge inside the row (status is already communicated by the section)
- Selected row: left accent border (`border-l-2 border-blue-400`) instead of full-row background
- Sidebar width: fixed `w-72` (288px) to give names space

### Metrics strip

Replace the plain text block with a horizontal strip of four stat cards at the top of the sidebar, each showing:
- Icon (simple inline SVG: clock, play, check, archive)
- Count (large, bold)
- Label (small, muted)
- Color accent matching status: blue → in progress, amber → backlog, green → done, zinc → archived

### Detail panel

- Header: change name in `text-xl font-semibold` + status badge, progress fraction + percentage on the same line
- Progress bar: taller (`h-3`), rounded, with a subtle glow on the fill for in-progress state
- Task list: each row has a fixed-width left column with the task number (muted), a checkbox icon (✓ green / ○ zinc), and the label with `leading-relaxed`
- Artifacts row at the bottom: `proposal.md`, `design.md`, `tasks.md` as pill badges — grayed out when absent, colored when present

### Empty state

Replace the plain "Select a change" with:
- A subtle grid/dot pattern background
- Centered icon (inbox SVG)
- `Pick a change from the sidebar` heading
- `3 in progress · 28 done · 24 archived` subline using live counts

## Out of Scope

- No new data or API changes
- No filters, search, or sorting controls (post-MVP)
- No animations beyond Tailwind transitions already in use
- TUI is a separate change
