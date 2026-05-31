import { useState } from "react";

type State = "idle" | "confirming" | "loading" | "error";

interface ArchiveButtonProps {
  changeId: string;
  changeName: string;
}

export function ArchiveButton({ changeId, changeName }: ArchiveButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const confirm = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/changes/${encodeURIComponent(changeId)}/archive`, {
        method: "POST",
      });
      if (res.ok) {
        // watcher broadcasts change_updated automatically — no extra action needed
      } else {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        setErrorMsg(body.error ?? "Archive failed");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error");
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <button
        onClick={() => setState("confirming")}
        className="px-3 py-1.5 text-xs rounded border border-zinc-700 text-zinc-400 hover:border-amber-600 hover:text-amber-400 transition-colors"
      >
        Archive
      </button>
    );
  }

  if (state === "confirming") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-500">
          Move <span className="text-zinc-300">"{changeName}"</span> to archive?
        </span>
        <button
          onClick={confirm}
          className="px-2.5 py-1 text-xs rounded border border-amber-700 text-amber-400 hover:bg-amber-900/30 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => setState("idle")}
          className="px-2.5 py-1 text-xs rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (state === "loading") {
    return <span className="text-xs text-zinc-500">Archiving…</span>;
  }

  // error
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-red-400">{errorMsg}</span>
      <button
        onClick={() => setState("idle")}
        className="text-xs text-zinc-500 hover:text-zinc-300"
      >
        Dismiss
      </button>
    </div>
  );
}
