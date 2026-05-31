import React from "react";
import { Box, Text } from "ink";
import type { Task } from "../types.js";

interface TaskItemProps {
  task: Task;
  index: number;
  maxWidth: number;
}

export function TaskItem({ task, index, maxWidth }: TaskItemProps) {
  const prefix = `${String(index + 1).padStart(2)}. `;
  const reserved = 7 + prefix.length;
  const label =
    task.label.length > maxWidth - reserved
      ? task.label.slice(0, maxWidth - reserved - 1) + "…"
      : task.label;

  return (
    <Box>
      <Text color={task.completed ? "green" : "gray"}>{task.completed ? " ✓ " : " ○ "}</Text>
      <Text color="gray" dimColor>{prefix}</Text>
      <Text color={task.completed ? "gray" : "white"} dimColor={task.completed}>
        {label}
      </Text>
    </Box>
  );
}
