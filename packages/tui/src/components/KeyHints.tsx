import React from "react";
import { Box, Text } from "ink";

export function KeyHints() {
  return (
    <Box borderTop borderStyle="single" borderColor="gray" paddingX={1}>
      <Text color="gray" dimColor>↑↓/jk move · a toggle archived · q quit</Text>
    </Box>
  );
}
