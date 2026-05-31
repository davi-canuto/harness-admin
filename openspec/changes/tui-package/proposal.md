# Proposal: TUI Package (Terminal UI)

## Problem

Some developers prefer to stay in the terminal without opening a browser. The same change data should be accessible in a terminal-native interface, navigable with arrow keys.

## Proposed Solution

Create `packages/tui` (`@harness/tui`) — an Ink-based terminal UI that:

- Fetches the initial change list from `GET /api/changes` on the local server
- Renders a two-column layout: change list on the left, task detail on the right
- Supports keyboard navigation with arrow keys to move between changes
- Reuses the same domain types as the browser board (same `Change` / `Task` shape)

## Constraints

- No WebSocket in MVP — fetches once on startup (live updates are a post-MVP concern for TUI)
- Ink v5 (React 18 compatible)
- No color theme library — uses Ink's built-in `color` prop
