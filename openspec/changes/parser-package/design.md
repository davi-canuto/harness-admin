# Design: Parser Package

## Package Identity

```
name: @harness/parser
type: module (pure ESM)
build: tsup → dist/index.js + dist/index.d.ts
```

## Types (`src/types.ts`)

```ts
type Status = "backlog" | "in_progress" | "done" | "archived"

interface Task { id: string; label: string; completed: boolean }

interface Change {
  id: string; name: string; path: string; status: Status
  tasks: Task[]; totalTasks: number; completedTasks: number; progress: number
  hasProposal: boolean; hasDesign: boolean; hasTasks: boolean
}

interface Config {
  changesDir: string; archiveDir: string
  tasksFile: string; proposalFile: string; designFile: string; port: number
}

type WatcherEvent =
  | { type: "change_added";   change: Change }
  | { type: "change_updated"; change: Change }
  | { type: "change_removed"; id: string }
```

## Parser (`src/parser.ts`)

Reads the file at `filePath`, runs a global regex over it, returns `Task[]`.

Pattern: `/^[-*]\s+\[(x| )\]\s+(.+)$/gim`

Returns `[]` (not an error) if the file does not exist.

## Classifier (`src/classifier.ts`)

Receives `(changePath, archiveDir, tasks)`. Priority:

1. If `resolve(changePath)` starts with `resolve(archiveDir)` → `"archived"`
2. If `tasks.length === 0` OR `completedTasks === 0` → `"backlog"`
3. If all tasks completed → `"done"`
4. Otherwise → `"in_progress"`

Uses `path.resolve` on both paths to handle relative/absolute mismatches.

## Reader (`src/reader.ts`)

- Receives `(rootDir, config)`
- Entry point: `join(rootDir, config.changesDir)`
- Iterates directory entries; for each subdirectory, builds a `Change` object
- Recurses into subdirectories to pick up the `archive/` folder
- Returns `Change[]`

## Watcher (`src/watcher.ts`)

- Calls `readChanges` once on startup to populate the cache (`Map<id, Change>`)
- Starts a chokidar watcher on `changesDir` with `{ ignoreInitial: true, depth: 4 }`
- On every `"all"` event: calls `readChanges` again, diffs against cache, emits typed events
- Returns `{ close(), getAll() }`

## Dependencies

- `gray-matter` — available for frontmatter parsing (not used in MVP but installed for future use)
- `chokidar` — file watching
- `@types/node` (dev) — Node.js built-ins (`fs`, `path`)
