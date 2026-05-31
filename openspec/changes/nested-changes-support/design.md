# Design: Nested Changes Support

## Files changed

| File | Action |
|---|---|
| `packages/parser/src/types.ts` | Add `children?`, `isChild?` to `Change` |
| `packages/parser/src/reader.ts` | Scan two levels, build parent/child tree |
| `packages/parser/src/classifier.ts` | Accept aggregate task counts for parent classification |
| `packages/board/src/types.ts` | Mirror parser type changes |
| `packages/board/src/components/Sidebar.tsx` | Render parent rows with children |
| `packages/board/src/components/ChangeDetail.tsx` | Branch on parent vs child |
| `packages/board/src/components/ParentDetail.tsx` | New — aggregated view for parent changes |
| `packages/tui/src/types.ts` | Mirror parser type changes |
| `packages/tui/src/components/ChangeList.tsx` | Render nested rows |
| `packages/tui/src/App.tsx` | Flat nav list includes children |

---

## Parser — types (`src/types.ts`)

```ts
interface Change {
  id: string
  name: string
  path: string
  status: Status
  tasks: Task[]
  totalTasks: number
  completedTasks: number
  progress: number
  hasProposal: boolean
  hasDesign: boolean
  hasTasks: boolean
  children?: Change[]   // only on parent changes
  isChild?: boolean     // only on sub-changes
}
```

---

## Parser — reader (`src/reader.ts`)

Replace the current flat scan with a two-level scan:

```
scanDir(changesDir):
  for each entry (direct child of changesDir):
    skip if entry == archiveDir

    if entry has tasks.md:
      → build leaf Change (as today)

    else:
      grandchildren = subdirs of entry that have tasks.md
      if grandchildren.length > 0:
        → build parent Change:
            children = grandchildren.map(buildChange)
            totalTasks = sum(children[*].totalTasks)
            completedTasks = sum(children[*].completedTasks)
            progress = round(completedTasks / totalTasks * 100)
            status = classifyStatus(path, archivePath, aggregated tasks)
            tasks = []   (parent has no own tasks)
      else:
        → build backlog Change (no tasks, no children)
```

`buildChange` is the existing helper — unchanged for leaf changes.

For `classifyStatus` on a parent, pass a synthetic task array:
```ts
const syntheticTasks = children.flatMap(c => c.tasks)
classifyStatus(parentPath, archivePath, syntheticTasks)
```

---

## Board — Sidebar (`Sidebar.tsx`)

Add parent rendering inside the section loop:

```tsx
{items.map((change) => (
  <React.Fragment key={change.id}>
    {/* Parent or leaf row */}
    <button
      onClick={() => change.children ? toggleParent(change.id) : onSelect(change.id)}
      className={rowClass(change.id, selectedId)}
    >
      <span className="flex-1 break-words leading-snug">{change.name}</span>
      {change.totalTasks > 0 && (
        <span className="text-[11px] text-zinc-600 tabular-nums shrink-0">
          {change.completedTasks}/{change.totalTasks}
        </span>
      )}
      {change.children && <ChevronIcon open={expandedParents.has(change.id)} />}
    </button>

    {/* Child rows — shown when parent is expanded */}
    {change.children && expandedParents.has(change.id) && change.children.map(child => (
      <button
        key={child.id}
        onClick={() => onSelect(child.id)}
        className={`pl-8 ${rowClass(child.id, selectedId)}`}
      >
        <span className="flex-1 break-words leading-snug">{child.name}</span>
        {child.totalTasks > 0 && (
          <span className="text-[11px] text-zinc-600 tabular-nums shrink-0">
            {child.completedTasks}/{child.totalTasks}
          </span>
        )}
      </button>
    ))}
  </React.Fragment>
))}
```

State: `expandedParents: Set<string>` — parents expanded by default if `status === "in_progress"`.

`onSelect` is called only for leaf changes and children, not for parent rows (clicking a parent toggles expand/collapse).

---

## Board — ParentDetail (`ParentDetail.tsx`)

New component, rendered when the selected change has `children`:

```
platform-v2                          [ in progress ]

████████████████░░░░░░░░  8/12  66%

Sub-changes

  auth-layer          ████████████  5/7   71%   [ in progress ]
  payments            ██████░░░░░░  3/5   60%   [ in progress ]
```

Each sub-change row is a button that calls `onSelect(child.id)`.

---

## Board — ChangeDetail (`ChangeDetail.tsx`)

Add a branch at the top:

```tsx
if (change.children) {
  return <ParentDetail change={change} onSelectChild={onSelect} />;
}
// existing detail rendering for leaf changes
```

`onSelect` needs to be threaded from `App` down to `ChangeDetail`.

---

## TUI — ChangeList (`ChangeList.tsx`)

For each item in a section, if it has children:
1. Render the parent row (bold, aggregated fraction)
2. Render children indented when section is expanded

```tsx
<Text bold color={isSelected ? "cyan" : statusColor[status]}>
  {isSelected ? "▶ " : "  "}{name}
</Text>
{change.children?.map(child => (
  <Text key={child.id} color={isSelected(child) ? "cyan" : "gray"}>
    {isSelected(child) ? "  ▶ " : "    "}{truncate(child.name, maxName - 4)}
  </Text>
))}
```

---

## TUI — App (`App.tsx`)

`navList` must include children as individual navigable items:

```ts
const navList = useMemo(() => {
  const result: Change[] = [];
  for (const status of SECTION_ORDER) {
    const items = byStatus[status];
    for (const change of items) {
      if (change.children) {
        result.push(...change.children); // navigate into children, skip parent
      } else {
        result.push(change);
      }
    }
  }
  return result;
}, [changes, archivedOpen]);
```
