import { useEffect, useReducer, useRef, useState } from "react";
import type { Change } from "../types.ts";

type State = {
  changes: Change[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "snapshot"; changes: Change[] }
  | { type: "change_added"; change: Change }
  | { type: "change_updated"; change: Change }
  | { type: "change_removed"; id: string }
  | { type: "error"; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "snapshot":
      return { changes: action.changes, loading: false, error: null };
    case "change_added":
      return { ...state, changes: [...state.changes, action.change] };
    case "change_updated":
      return {
        ...state,
        changes: state.changes.map((c) =>
          c.id === action.change.id ? action.change : c
        ),
      };
    case "change_removed":
      return {
        ...state,
        changes: state.changes.filter((c) => c.id !== action.id),
      };
    case "error":
      return { ...state, loading: false, error: action.message };
    default:
      return state;
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);
  return projects;
}

export function useChanges(activeProject: string | null = null) {
  const [state, dispatch] = useReducer(reducer, {
    changes: [],
    loading: true,
    error: null,
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    // re-fetch via HTTP when a specific project or "all" is selected
    if (activeProject !== null) {
      dispatch({ type: "snapshot", changes: [] }); // clear immediately on switch
      const url = activeProject === "__all__"
        ? "/api/changes/all"
        : `/api/changes?project=${encodeURIComponent(activeProject)}`;
      fetch(url)
        .then((r) => r.json())
        .then((changes) => dispatch({ type: "snapshot", changes }))
        .catch(() => dispatch({ type: "error", message: "Failed to load changes" }));
      return;
    }

    function connect() {
      if (cancelled) return;
      const ws = new WebSocket(`ws://${location.host}/ws`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data as string);
        dispatch(msg);
      };

      ws.onerror = () => {
        dispatch({ type: "error", message: "WebSocket connection failed" });
      };

      ws.onclose = () => {
        if (!cancelled) setTimeout(connect, 2000);
      };
    }

    connect();
    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, [activeProject]);

  return state;
}
