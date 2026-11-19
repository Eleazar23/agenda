import { Paper, Grid } from "@mui/material";
import type { ReactNode } from "react";

const paperSx = { padding: 2, width: "100%" } as const;

const actionBarSx = {
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  width: "100%",
  gap: 1,
} as const;

export interface PageActionBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

function PageActionBar({ left, center, right }: PageActionBarProps) {
  return (
    <Paper sx={paperSx}>
      <Grid container component="div" sx={actionBarSx}>
        <Grid size={4} sx={{ display: "flex", alignItems: "center" }}>
          {left}
        </Grid>
        <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
          {center}
        </Grid>
        <Grid
          size={4}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          {right}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PageActionBar;
