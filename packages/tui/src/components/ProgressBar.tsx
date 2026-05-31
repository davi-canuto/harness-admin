import React from "react";
import { Box, Text } from "ink";
import type { Status } from "../types.js";

interface ProgressBarProps {
  value: number;
  completed: number;
  total: number;
  status: Status;
  width: number;
}

const STATUS_COLOR: Record<Status, string> = {
  in_progress: "cyan",
  done: "green",
  backlog: "gray",
  archived: "gray",
};

export function ProgressBar({ value, completed, total, status, width }: ProgressBarProps) {
  const barWidth = Math.max(8, width - 16);
  const filled = Math.round((value / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const color = STATUS_COLOR[status];

  return (
    <Box>
      <Text color={color}>{bar}</Text>
      <Text color="gray">  {completed}/{total}  {value}%</Text>
    </Box>
  );
}
