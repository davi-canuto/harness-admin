import type { Task } from "../types.ts";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-zinc-600 text-sm">No tasks found.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {tasks.map((task, i) => (
        <li key={task.id} className="flex items-start gap-3">
          <span className="text-[11px] text-zinc-600 tabular-nums w-6 shrink-0 pt-0.5 text-right">
            {i + 1}
          </span>
          <span className={`shrink-0 mt-0.5 text-sm ${task.completed ? "text-green-400" : "text-zinc-600"}`}>
            {task.completed ? "✓" : "○"}
          </span>
          <span
            className={`leading-relaxed text-sm ${
              task.completed
                ? "text-zinc-500 line-through decoration-zinc-700"
                : "text-zinc-200"
            }`}
          >
            {task.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
