import { Box, Button, Typography, styled } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const Guide = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    loadingState: { setIsLoading },
  } = useAppContext();

  const handleBack = async () => {
    setIsLoading(true);
    try {
      navigate(`/`);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <LayoutGame>
      <StyledButton
        sx={{
          padding: 0,
          position: "fixed",
          top: "3vh",
          left: "3vw",
          color: "#111",
        }}
        onClick={handleBack}
      >
        <ArrowLeftIcon color="#111" fontSize="large" />
      </StyledButton>
      <Box>Guide</Box>
    </LayoutGame>
  );
};

export default Guide;
