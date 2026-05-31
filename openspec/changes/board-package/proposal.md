# Proposal: Board Package (Browser UI)

## Problem

Developers need a visual, browser-based dashboard to see all SDD changes at a glance: how many are in backlog, in progress, done, or archived; and the task-level breakdown for any selected change. The view must update in real time as files change on disk.

## Proposed Solution

Create `packages/board` (`@harness/board`) — a Vite + React + Tailwind SPA that:

- Connects to the local server via WebSocket and maintains a live snapshot of all changes
- Renders a split-view layout: sidebar on the left (metrics + change list), detail panel on the right
- Auto-reconnects the WebSocket on disconnect with a 2-second backoff
- Uses Tailwind CSS for styling; no external component libraries
- Uses only inline SVGs for icons (no icon library dependencies)

## Non-Goals

- No server-side rendering
- No authentication
- No write operations in MVP (archive, apply, etc. are post-MVP)
