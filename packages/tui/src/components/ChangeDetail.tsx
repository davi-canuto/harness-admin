import React from "react";
import { Box, Text } from "ink";
import type { Change, Status } from "../types.js";
import { ProgressBar } from "./ProgressBar.js";
import { TaskItem } from "./TaskItem.js";

interface ChangeDetailProps {
  change: Change;
  width: number;
}

const STATUS_LABEL: Record<Status, string> = {
  in_progress: "in progress",
  done: "done",
  backlog: "backlog",
  archived: "archived",
};

const STATUS_COLOR: Record<Status, string> = {
  in_progress: "cyan",
  done: "green",
  backlog: "yellow",
  archived: "gray",
};

export function ChangeDetail({ change, width }: ChangeDetailProps) {
  const badge = `[ ${STATUS_LABEL[change.status]} ]`;
  const nameMax = width - badge.length - 3;
  const name =
    change.name.length > nameMax
      ? change.name.slice(0, nameMax - 1) + "…"
      : change.name;

  return (
    <Box flexDirection="column" paddingX={2} flexGrow={1}>
      <Box gap={1}>
        <Text bold color="white">{name}</Text>
        <Text color={STATUS_COLOR[change.status]}>{badge}</Text>
      </Box>

      <Text> </Text>

      {change.totalTasks > 0 ? (
        <ProgressBar
          value={change.progress}
          completed={change.completedTasks}
          total={change.totalTasks}
          status={change.status}
          width={width - 4}
        />
      ) : (
        <Text color="gray" dimColor>No tasks</Text>
      )}

      <Text> </Text>

      {change.tasks.length > 0 && (
        <>
          <Text color="gray" dimColor>Tasks</Text>
          {change.tasks.map((task, i) => (
            <TaskItem key={task.id} task={task} index={i} maxWidth={width - 4} />
          ))}
          <Text> </Text>
        </>
      )}

      <Box gap={2}>
        <Text color={change.hasProposal ? "gray" : "gray"} dimColor={!change.hasProposal}>
          {change.hasProposal ? "proposal.md" : <Text strikethrough>proposal.md</Text>}
        </Text>
        <Text color={change.hasDesign ? "gray" : "gray"} dimColor={!change.hasDesign}>
          {change.hasDesign ? "design.md" : <Text strikethrough>design.md</Text>}
        </Text>
        <Text color={change.hasTasks ? "gray" : "gray"} dimColor={!change.hasTasks}>
          {change.hasTasks ? "tasks.md" : <Text strikethrough>tasks.md</Text>}
        </Text>
      </Box>
    </Box>
  );
}
