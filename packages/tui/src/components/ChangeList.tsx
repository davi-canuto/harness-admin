import React from "react";
import { Box, Text } from "ink";
import type { Change, Status } from "../types.js";

interface ChangeListProps {
  changes: Change[];
  selectedId: string | null;
  archivedOpen: boolean;
  width: number;
}

const SECTIONS: { status: Status; label: string }[] = [
  { status: "in_progress", label: "IN PROGRESS" },
  { status: "backlog",     label: "BACKLOG"     },
  { status: "done",        label: "DONE"        },
  { status: "archived",    label: "ARCHIVED"    },
];

const STATUS_COLOR: Record<Status, string> = {
  in_progress: "blue",
  done: "green",
  backlog: "yellow",
  archived: "gray",
};

export function ChangeList({ changes, selectedId, archivedOpen, width }: ChangeListProps) {
  const byStatus: Record<Status, Change[]> = {
    in_progress: [], backlog: [], done: [], archived: [],
  };
  for (const c of changes) byStatus[c.status].push(c);

  const maxName = width - 4;

  return (
    <Box flexDirection="column" width={width} paddingX={1}>
      <Text bold color="white">HARNESS</Text>
      <Text> </Text>

      {SECTIONS.map(({ status, label }) => {
        const items = byStatus[status];
        if (items.length === 0) return null;

        const isArchived = status === "archived";
        const showItems = isArchived ? archivedOpen : true;

        return (
          <Box key={status} flexDirection="column">
            <Text color="gray">── {label} ({items.length}) {isArchived && !archivedOpen ? "▸" : "──"}</Text>

            {showItems && items.map((change) => {
              const isSelected = change.id === selectedId;
              const name =
                change.name.length > maxName
                  ? change.name.slice(0, maxName - 1) + "…"
                  : change.name;

              return (
                <Text
                  key={change.id}
                  color={isSelected ? "cyan" : STATUS_COLOR[status]}
                  bold={isSelected}
                >
                  {isSelected ? "▶ " : "  "}{name}
                </Text>
              );
            })}

            <Text> </Text>
          </Box>
        );
      })}
    </Box>
  );
}
