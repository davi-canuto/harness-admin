# Design: TUI Package (Terminal UI)

## Package Identity

```
name: @harness/tui
type: module (pure ESM)
build: tsup → dist/index.js (no DTS — consumed only by @harness/cli)
jsx: transform (tsup handles JSX for Ink)
```

## Layout

```
┌──────────────────────────────┬──────────────────────────────────────┐
│ Harness Admin                │ change-name                          │
│ ──────────────────           │ Status: in_progress  7/10 (70%)      │
│ > change-name                │ ──────────────────                   │
│   other-change               │ ✓ task one                           │
│   another-one                │ ✓ task two                           │
│                              │ ○ task three                         │
└──────────────────────────────┴──────────────────────────────────────┘
```

Two `Box` components side by side with `borderStyle="single"`.

## Component: `App` (`src/App.tsx`)

Props: `{ changes: Change[] }`

State: `cursor: number` (index into changes array)

Input handling via Ink's `useInput`:
- `upArrow` → `cursor - 1` (clamped to 0)
- `downArrow` → `cursor + 1` (clamped to length - 1)

Renders selected change's tasks with `✓` (green) / `○` (gray).

## Entry Point (`src/index.tsx`)

```ts
export async function startTUI(serverUrl: string) {
  const res = await fetch(`${serverUrl}/api/changes`)
  const changes = await res.json()
  render(<App changes={changes} />)
}
```

## Types (`src/types.ts`)

Same shape as `@harness/parser` — inlined to avoid pulling Node.js packages into the Ink render tree.

## Dependencies

- `ink` — React renderer for terminals
- `react` — peer of Ink
- `@types/react` (dev)
