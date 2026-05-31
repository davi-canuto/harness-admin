interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: string;
}

export function StatCard({ icon, count, label, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-2">
      <span className={color}>{icon}</span>
      <span className={`text-lg font-bold tabular-nums leading-none ${color}`}>{count}</span>
      <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</span>
    </div>
  );
}
