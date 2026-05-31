export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-zinc-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
