import type { Task } from "../types.ts";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-zinc-500 text-sm">No tasks found.</p>;
  }

  return (
    <ul className="space-y-1">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-2 text-sm">
          <span className={task.completed ? "text-green-400" : "text-zinc-500"}>
            {task.completed ? "✓" : "○"}
          </span>
          <span className={task.completed ? "text-zinc-400 line-through" : "text-zinc-200"}>
            {task.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
