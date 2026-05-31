import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Change } from "./types.js";

interface AppProps {
  changes: Change[];
}

export function App({ changes }: AppProps) {
  const [cursor, setCursor] = useState(0);
  const selected = changes[cursor] ?? null;

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(changes.length - 1, c + 1));
  });

  return (
    <Box flexDirection="row" height="100%">
      <Box
        flexDirection="column"
        width={30}
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold color="white">
          Harness Admin
        </Text>
        <Text color="gray">──────────────────</Text>
        {changes.map((c, i) => (
          <Text key={c.id} color={i === cursor ? "cyan" : "gray"}>
            {i === cursor ? "> " : "  "}
            {c.name}
          </Text>
        ))}
      </Box>

      <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor="gray" paddingX={1}>
        {selected ? (
          <>
            <Text bold color="white">
              {selected.name}
            </Text>
            <Text color="gray">
              Status: {selected.status}  {selected.completedTasks}/{selected.totalTasks} tasks ({selected.progress}%)
            </Text>
            <Text color="gray">──────────────────</Text>
            {selected.tasks.map((t) => (
              <Text key={t.id} color={t.completed ? "green" : "gray"}>
                {t.completed ? "✓" : "○"} {t.label}
              </Text>
            ))}
          </>
        ) : (
          <Text color="gray">No change selected</Text>
        )}
      </Box>
    </Box>
  );
}
