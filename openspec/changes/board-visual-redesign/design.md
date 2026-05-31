# Design: Board Visual Redesign

## Component map (what changes vs. what's new)

| File | Action |
|---|---|
| `src/components/Sidebar.tsx` | Rewrite |
| `src/components/StatCard.tsx` | New |
| `src/components/ChangeDetail.tsx` | Rewrite |
| `src/components/TaskList.tsx` | Rewrite |
| `src/components/ProgressBar.tsx` | Update (height + glow) |
| `src/components/StatusBadge.tsx` | Keep as-is |
| `src/components/EmptyState.tsx` | New |
| `src/App.tsx` | Minor — swap EmptyState, pass counts to it |

---

## Sidebar (`Sidebar.tsx`)

### Layout

```
┌────────────────────────────────────────┐
│  [clock] 3   [play] 3   [✓] 28  [📦] 24  ← StatCard strip
│──────────────────────────────────────────
│  IN PROGRESS  3                           ← section header
│  ▌ community-youtube-videos    13/18      ← selected (accent border)
│    openpix-pix-payment         19/25
│    landing-page                 9/10
│──────────────────────────────────────────
│  BACKLOG  3
│    content-recommendations       0/0
│    purchase-confirmation-email   0/0
│    stripe-connect                0/0
│──────────────────────────────────────────
│  DONE  28
│    admin-booking-management    22/22
│    ...
│──────────────────────────────────────────
│  ARCHIVED  24  ▾                          ← collapsed by default
└────────────────────────────────────────┘
```

### Section header

```tsx
<button className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase hover:text-zinc-300">
  <span>{label}  {count}</span>
  {collapsible && <ChevronIcon open={open} />}  // only for ARCHIVED
</button>
```

### Change row

```tsx
<button
  className={`w-full flex items-center justify-between px-4 py-2 text-sm gap-3 border-l-2 transition-colors
    ${selected
      ? "border-blue-400 bg-zinc-800/60 text-zinc-100"
      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
    }`}
>
  <span className="flex-1 text-left break-words leading-snug">{change.name}</span>
  {change.totalTasks > 0 && (
    <span className="text-[11px] text-zinc-600 tabular-nums shrink-0">
      {change.completedTasks}/{change.totalTasks}
    </span>
  )}
</button>
```

### Status order constant

```ts
const SECTIONS: { status: Status; label: string; collapsible: boolean }[] = [
  { status: "in_progress", label: "In Progress", collapsible: false },
  { status: "backlog",     label: "Backlog",     collapsible: false },
  { status: "done",        label: "Done",        collapsible: false },
  { status: "archived",    label: "Archived",    collapsible: true  },
];
```

---

## StatCard (`StatCard.tsx`)

```tsx
interface StatCardProps {
  icon: React.ReactNode;  // inline SVG
  count: number;
  label: string;
  color: string;  // Tailwind text color class, e.g. "text-blue-400"
}
```

Strip layout in Sidebar header:

```tsx
<div className="grid grid-cols-4 gap-1 p-3 border-b border-zinc-800">
  <StatCard icon={<PlayIcon />}    count={counts.in_progress} label="active"   color="text-blue-400" />
  <StatCard icon={<ClockIcon />}   count={counts.backlog}     label="backlog"  color="text-amber-400" />
  <StatCard icon={<CheckIcon />}   count={counts.done}        label="done"     color="text-green-400" />
  <StatCard icon={<ArchiveIcon />} count={counts.archived}    label="archived" color="text-zinc-500" />
</div>
```

Each card:

```tsx
<div className="flex flex-col items-center gap-0.5 py-2">
  <span className={`${color}`}>{icon}</span>   // 16×16 SVG
  <span className={`text-lg font-bold tabular-nums ${color}`}>{count}</span>
  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</span>
</div>
```

---

## ProgressBar (`ProgressBar.tsx`)

```tsx
// h-2 → h-3, add glow for in_progress
<div className="w-full bg-zinc-700/50 rounded-full h-3">
  <div
    className={`h-3 rounded-full transition-all duration-500
      ${inProgress ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-green-500"}`}
    style={{ width: `${value}%` }}
  />
</div>
```

`ProgressBar` receives an optional `inProgress?: boolean` prop; `ChangeDetail` passes `change.status === "in_progress"`.

---

## ChangeDetail (`ChangeDetail.tsx`)

### Header block

```tsx
<div className="flex items-start justify-between gap-4">
  <h2 className="text-xl font-semibold text-zinc-100 leading-tight break-words">{change.name}</h2>
  <StatusBadge status={change.status} />
</div>

<div className="flex items-center gap-3 text-sm text-zinc-400 mt-1">
  <span className="tabular-nums">{change.completedTasks}/{change.totalTasks} tasks</span>
  <span className="text-zinc-600">·</span>
  <span className="tabular-nums font-medium text-zinc-300">{change.progress}%</span>
</div>

<ProgressBar value={change.progress} inProgress={change.status === "in_progress"} />
```

### Artifacts row

```tsx
// pill: colored when present, muted + line-through when absent
{[
  { key: "hasProposal", label: "proposal.md" },
  { key: "hasDesign",   label: "design.md"   },
  { key: "hasTasks",    label: "tasks.md"    },
].map(({ key, label }) => (
  <span key={key} className={`px-2.5 py-1 rounded-full text-xs font-medium border
    ${change[key as keyof Change]
      ? "border-zinc-600 text-zinc-300 bg-zinc-800"
      : "border-zinc-800 text-zinc-600 line-through"
    }`}>
    {label}
  </span>
))}
```

---

## TaskList (`TaskList.tsx`)

```tsx
<ul className="space-y-1.5">
  {tasks.map((task, i) => (
    <li key={task.id} className="flex items-start gap-3 group">
      <span className="text-[11px] text-zinc-600 tabular-nums w-6 shrink-0 pt-0.5 text-right">
        {i + 1}
      </span>
      <span className={`shrink-0 mt-0.5 ${task.completed ? "text-green-400" : "text-zinc-600"}`}>
        {task.completed ? "✓" : "○"}
      </span>
      <span className={`leading-relaxed text-sm
        ${task.completed ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-200"}`}>
        {task.label}
      </span>
    </li>
  ))}
</ul>
```

---

## EmptyState (`EmptyState.tsx`)

```tsx
interface EmptyStateProps {
  counts: Record<Status, number>;
}
```

```tsx
<div className="flex flex-col items-center justify-center h-full gap-4
  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
  from-zinc-800/20 via-zinc-900 to-zinc-900">
  <InboxIcon className="w-12 h-12 text-zinc-700" />
  <p className="text-zinc-400 font-medium">Pick a change from the sidebar</p>
  <p className="text-zinc-600 text-sm">
    {counts.in_progress} in progress · {counts.done} done · {counts.archived} archived
  </p>
</div>
```

---

## Inline SVG icons

Four icons needed — all inline, no library:

- `PlayIcon` (16×16) — circle with play triangle
- `ClockIcon` (16×16) — circle clock
- `CheckIcon` (16×16) — circle with checkmark
- `ArchiveIcon` (16×16) — box with down arrow
- `InboxIcon` (48×48) — inbox tray for empty state
- `ChevronIcon` (12×12) — rotates 180° when open

All defined as small functional components in `src/components/icons.tsx`.
