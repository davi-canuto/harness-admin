interface ProgressBarProps {
  value: number;
  inProgress?: boolean;
}

export function ProgressBar({ value, inProgress }: ProgressBarProps) {
  return (
    <div className="w-full bg-zinc-700/50 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${
          inProgress
            ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            : "bg-green-500"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
