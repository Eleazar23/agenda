import { useSnackbar } from "notistack";

type Props = {
  message: string;
  alertType: "success" | "error" | "warning" | "info";
};

function useGlobalAlert() {
  const { enqueueSnackbar } = useSnackbar();

  const showAlert = ( message: string, alertType: "success" | "error" | "warning" | "info" ) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };
  return { showAlert };
}

export default useGlobalAlert;
