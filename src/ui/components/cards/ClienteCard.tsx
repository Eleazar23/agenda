import { Card, CardContent, CardHeader, Divider, Grid } from "@mui/material";
import ClienteForm from "../forms/ClienteForm";

const ClienteCard = () => {
  return (
    <Card variant="outlined">
      <CardHeader title="Cliente" />
      <Divider sx={{ margin: "0 1rem" }} />
      <CardContent>
        <ClienteForm />
      </CardContent>
    </Card>
  );
};

export default ClienteCard;
