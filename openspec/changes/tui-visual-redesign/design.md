# Design: TUI Visual Redesign

## Package changes

- `packages/tui/src/App.tsx` — full rewrite
- `packages/tui/src/components/ProgressBar.tsx` — new
- `packages/tui/src/components/TaskItem.tsx` — new
- `packages/tui/src/components/ChangeList.tsx` — new
- `packages/tui/src/components/ChangeDetail.tsx` — new
- `packages/tui/src/components/KeyHints.tsx` — new
- `packages/tui/src/dev.tsx` — new (filesystem entry point)
- `packages/tui/package.json` — add `start` script

---

## Layout

```
┌─────────────────────────┬───────────────────────────────────────────┐
│ HARNESS ADMIN           │ community-youtube-videos                  │
│                         │ [ in progress ]                           │
│ ── IN PROGRESS (3) ──   │                                           │
│ ▶ community-youtube-… │ ████████░░░░░░░░  13/18  72%              │
│   openpix-pix-payment   │                                           │
│   landing-page          │ Tasks                                     │
│                         │  ✓  1. 1.1 Criar componente               │
│ ── BACKLOG (3) ──       │  ✓  2. 1.2 Integrar YouTube API           │
│   content-recommendati… │  ✓  3. 1.3 Thumbnail grid                 │
│   purchase-confirmatio… │  ○  4. 2.1 Paginação                      │
│   stripe-connect        │  ○  5. 2.2 Cache de resposta              │
│                         │                                           │
│ ── DONE (28) ──         │ proposal.md  design.md  tasks.md          │
│   admin-booking-manage… │                                           │
│   ...                   │                                           │
│                         │                                           │
│ ── ARCHIVED (24) ──     │                                           │
│   (collapsed)           │                                           │
├─────────────────────────┴───────────────────────────────────────────┤
│  ↑↓/jk move · a toggle archived · q quit                           │
└─────────────────────────────────────────────────────────────────────┘
```

Fixed layout: list panel `width={32}`, detail panel `flexGrow={1}`, key hints `height={1}` at the bottom.

---

## App (`src/App.tsx`)

State:
```ts
cursor: number              // index into flatList
archivedOpen: boolean       // default false
```

Derived:
```ts
const SECTIONS = ["in_progress", "backlog", "done", "archived"]
// flatList = all visible items (section headers + change rows)
// each item: { kind: "header" | "change", ... }
```

`useInput` handles: `↑`/`k` → cursor up, `↓`/`j` → cursor down (skip header items), `a` → toggle archived, `q`/`Escape` → `process.exit(0)`.

Ink layout:
```tsx
<Box flexDirection="column" height="100%">
  <Box flexGrow={1}>
    <ChangeList ... />
    <Box borderLeft ... flexGrow={1}>
      <ChangeDetail ... />
    </Box>
  </Box>
  <KeyHints />
</Box>
```

---

## ChangeList (`src/components/ChangeList.tsx`)

Props: `{ changes, cursor, archivedOpen, listWidth }`

Renders sections. Section header:
```tsx
<Text color="gray">── {LABEL[status]} ({count}) ──</Text>
```

Change row (truncate name to `listWidth - 4` chars):
```tsx
const name = change.name.length > maxLen
  ? change.name.slice(0, maxLen - 1) + "…"
  : change.name;

<Text color={isSelected ? "cyan" : statusColor[status]} bold={isSelected}>
  {isSelected ? "▶ " : "  "}{name}
</Text>
```

Status colors: `in_progress` → blue, `backlog` → yellow, `done` → green, `archived` → gray.

Archived section when collapsed: only show the header, no rows.

---

## ProgressBar (`src/components/ProgressBar.tsx`)

Props: `{ value: number; total: number; completed: number; status: Status; width: number }`

```ts
const filled = Math.round((value / 100) * barWidth);
const empty = barWidth - filled;
const bar = "█".repeat(filled) + "░".repeat(empty);
```

Color by status: `in_progress` → `cyan`, `done` → `green`, `backlog`/`archived` → `gray`.

Output: `<Text color={color}>{bar}</Text>  <Text>{completed}/{total}  {value}%</Text>`

Bar width = `detailWidth - 20` (leaves room for the fraction).

---

## ChangeDetail (`src/components/ChangeDetail.tsx`)

Props: `{ change: Change; width: number }`

Sections:
1. Name (bold) + status badge `[ in progress ]` on same line
2. Empty line
3. `<ProgressBar />`
4. Empty line
5. `Tasks` header + `<TaskItem />` per task
6. Empty line
7. Artifacts footer

---

## TaskItem (`src/components/TaskItem.tsx`)

Props: `{ task: Task; index: number; maxWidth: number }`

```tsx
const label = task.label.length > maxWidth - 7
  ? task.label.slice(0, maxWidth - 8) + "…"
  : task.label;

<Box>
  <Text color={task.completed ? "green" : "gray"}>
    {task.completed ? " ✓ " : " ○ "}
  </Text>
  <Text color="gray" dimColor>{String(index + 1).padStart(2)}. </Text>
  <Text color={task.completed ? "gray" : "white"} dimColor={task.completed}>
    {label}
  </Text>
</Box>
```

---

## KeyHints (`src/components/KeyHints.tsx`)

```tsx
<Box borderTop borderStyle="single" borderColor="gray" paddingX={1}>
  <Text color="gray" dimColor>
    ↑↓/jk move · a toggle archived · q quit
  </Text>
</Box>
```

---

## Dev entry point (`src/dev.tsx`)

Reads from filesystem directly via `@harness/parser`, no HTTP server needed:

```ts
import { readChanges } from "@harness/parser";
import { loadConfig } from "../../cli/src/config.js";

const rootDir = process.argv[2] ?? process.cwd();
const config = loadConfig();
const changes = readChanges(rootDir, config);
render(<App changes={changes} />);
```

Add to `packages/tui/package.json`:
```json
"start": "node --import tsx/esm src/dev.tsx"
```

And add `tsx` as devDependency so the script runs without a build step.

---

## Cursor navigation logic

`flatList` is an array of `{ kind: "header" | "change", change?: Change }`. When the user presses up/down, skip items where `kind === "header"`. The `cursor` always points to a `change` item.
