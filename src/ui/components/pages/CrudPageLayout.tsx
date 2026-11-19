import { Grid } from "@mui/material";
import type { ReactNode } from "react";

const containerSx = {
  width: "100%",
  height: "100%",
  justifyContent: "space-between",
  maxHeight: "100vh",
  flexWrap: "nowrap",
} as const;

const tableContainerSx = {
  height: "100%",
} as const;

export interface CrudPageLayoutProps {
  actionBar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function CrudPageLayout({ actionBar, children, footer }: CrudPageLayoutProps) {
  return (
    <Grid container sx={containerSx} direction="column" spacing={2}>
      <Grid container size={12}>
        {actionBar}
      </Grid>
      <Grid container sx={tableContainerSx} size={12}>
        {children}
      </Grid>
      {footer && (
        <Grid container size={12}>
          {footer}
        </Grid>
      )}
    </Grid>
  );
}

export default CrudPageLayout;
