import React, { useState, useMemo } from "react";
import { Box, useInput, useStdout } from "ink";
import type { Change, Status } from "./types.js";
import { ChangeList } from "./components/ChangeList.js";
import { ChangeDetail } from "./components/ChangeDetail.js";
import { KeyHints } from "./components/KeyHints.js";

interface AppProps {
  changes: Change[];
}

const SECTION_ORDER: Status[] = ["in_progress", "backlog", "done", "archived"];

export function App({ changes }: AppProps) {
  const { stdout } = useStdout();
  const termWidth = stdout?.columns ?? 160;
  const listWidth = 34;
  const detailWidth = Math.max(60, termWidth - listWidth - 2);

  const [archivedOpen, setArchivedOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const first = changes.find(
      (c) => c.status === "in_progress" || c.status === "backlog"
    );
    return first?.id ?? changes[0]?.id ?? null;
  });

  // Flat navigable list (only change items, no headers)
  const navList = useMemo(() => {
    const result: Change[] = [];
    for (const status of SECTION_ORDER) {
      if (status === "archived" && !archivedOpen) continue;
      result.push(...changes.filter((c) => c.status === status));
    }
    return result;
  }, [changes, archivedOpen]);

  const cursorIndex = navList.findIndex((c) => c.id === selectedId);

  useInput((input, key) => {
    const up = key.upArrow || input === "k";
    const down = key.downArrow || input === "j";

    if (up) {
      const next = Math.max(0, cursorIndex - 1);
      setSelectedId(navList[next]?.id ?? selectedId);
    } else if (down) {
      const next = Math.min(navList.length - 1, cursorIndex + 1);
      setSelectedId(navList[next]?.id ?? selectedId);
    } else if (input === "a") {
      setArchivedOpen((o) => !o);
    } else if (input === "q" || key.escape) {
      process.exit(0);
    }
  });

  const selected = changes.find((c) => c.id === selectedId) ?? null;

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1}>
        <ChangeList
          changes={changes}
          selectedId={selectedId}
          archivedOpen={archivedOpen}
          width={listWidth}
        />
        <Box borderLeft borderStyle="single" borderColor="gray" flexGrow={1}>
          {selected && (
            <ChangeDetail change={selected} width={detailWidth} />
          )}
        </Box>
      </Box>
      <KeyHints />
    </Box>
  );
}
