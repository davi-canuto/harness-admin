interface ProjectSwitcherProps {
  projects: string[];
  active: string | null;
  onChange: (project: string | null) => void;
}

export function ProjectSwitcher({ projects, active, onChange }: ProjectSwitcherProps) {
  if (projects.length <= 1) return null;

  return (
    <select
      value={active ?? "__all__"}
      onChange={(e) => onChange(e.target.value === "__all__" ? null : e.target.value)}
      className="text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400 rounded px-1.5 py-0.5 focus:outline-none focus:border-zinc-500 cursor-pointer"
    >
      <option value="__all__">All projects</option>
      {projects.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );
}
