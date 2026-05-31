# Proposal: Nested Changes Support

## Problem

The current reader scans only direct children of `changesDir`. A change that contains sub-changes — subdirectories with their own `tasks.md` — is invisible to Harness. The parent appears as `backlog` (no `tasks.md` of its own) and the children simply don't show up.

Example of a structure that is currently broken:

```
changes/
└── platform-v2/                 ← shows as "backlog" (no own tasks.md)
    ├── proposal.md
    ├── design.md
    └── auth-layer/              ← invisible
    │   └── tasks.md
    └── payments/                ← invisible
        └── tasks.md
```

This makes Harness unusable for projects that decompose large features into sub-changes.

## Proposed Solution

Extend the data model and UI to support one level of nesting: a **parent change** that groups **sub-changes**, with progress aggregated from all children.

### Data model

Add an optional `children` field to `Change`:

```ts
interface Change {
  // ... existing fields ...
  children?: Change[]    // present only on parent changes
  isChild?: boolean      // true when this change lives inside a parent
}
```

A directory is treated as a **parent** when:
- It has no `tasks.md` of its own, AND
- At least one of its direct subdirectories contains a `tasks.md`

A directory is treated as a **sub-change** when its parent directory is itself a change.

Parent progress is aggregated: `completedTasks` and `totalTasks` are the sum across all children. Parent `status` follows the same classification rules applied to that aggregate.

### Reader

Update `readChanges` to scan two levels deep. For each direct child of `changesDir`:
1. Check if it has a `tasks.md` → treat as a regular (leaf) change, as today
2. Check if any of its subdirectories have a `tasks.md` → treat as a parent, build `children[]`
3. If neither → still show as backlog (no tasks at all)

The `archive/` directory keeps its current behavior (one level inside it = archived changes).

### Board — sidebar

Parent changes render as a collapsible group in the sidebar:

```
 ── IN PROGRESS (2) ──
   platform-v2                  8/12  ▾     ← parent row, collapsible
     auth-layer                 5/7         ← child row, indented
     payments                   3/5         ← child row, indented
   other-change                 4/4
```

- Parent row: bold name, aggregated fraction, chevron
- Child rows: indented (`pl-8`), no chevron, same accent-border selection behavior
- Clicking the parent row selects the parent (shows aggregated detail)
- Clicking a child row selects that child

### Board — detail panel

**Parent selected:** shows aggregated progress bar + list of children as cards (name, fraction, mini progress bar). No task list (parent has none).

**Child selected:** same as today — progress bar + full task list + artifacts.

### TUI

Parent changes show as a collapsible group with `▶`/`▸` prefix. Children are indented by 2 spaces. Navigation moves through both parents and children as individual cursor positions.

## Out of Scope

- More than one level of nesting (grandchildren)
- A parent that has both its own `tasks.md` AND sub-changes (ambiguous — treated as a leaf)
- Moving or re-parenting changes via the UI
