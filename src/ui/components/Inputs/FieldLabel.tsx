import type { ReactNode } from "react";
import { Typography } from "@mui/material";

type Props = {
  children: ReactNode;
  htmlFor?: string;
};

export default function FieldLabel({ children, htmlFor }: Props) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", mb: 0.5 }}
    >
      {children}
    </Typography>
  );
}
