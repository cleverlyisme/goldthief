import { Box, Button, Typography, styled } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledTypo = styled(Typography)({
  fontFamily: "'Luckiest Guy', cursive",
  fontWeight: "500",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "5px 0",
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
          position: "absolute",
          top: "3vh",
          left: "3vw",
          color: "#111",
        }}
        onClick={handleBack}
      >
        <ArrowLeftIcon color="#111" fontSize="large" />
      </StyledButton>
      <Box
        display="flex"
        flexDirection="column"
        width={{ xs: "90vw", md: "80vw" }}
        flexWrap="wrap"
        borderRadius="24px"
        sx={{ background: "rgba(255, 253, 253, 0.5)", px: 3, py: 2 }}
      >
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          This is a 2-player game where players create and join rooms to compete
          against each other. The objective is to collect treasures placed in
          different coordinates within a limited time frame.
        </StyledTypo>

        <StyledTypo color="red" fontSize={{ xs: 18, md: 22 }}>
          Before start:
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          You must place all the treasures on coordinates that you want. There
          are 3 types of treasures:
        </StyledTypo>
        <StyledBox>
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>-</StyledTypo>
          <Box
            component="img"
            width="30px"
            height="30px"
            src="assets/images/firstTreasure.png"
          />
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>
            Points: 10, Quantity: 4
          </StyledTypo>
        </StyledBox>
        <StyledBox>
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>-</StyledTypo>
          <Box
            component="img"
            width="30px"
            height="30px"
            src="assets/images/secondTreasure.png"
          />
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>
            Points: 20, Quantity: 3
          </StyledTypo>
        </StyledBox>
        <StyledBox>
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>-</StyledTypo>
          <Box
            component="img"
            width="30px"
            height="30px"
            src="assets/images/thirdTreasure.png"
          />
          <StyledTypo fontSize={{ xs: 18, md: 22 }}>
            Points: 30, Quantity: 2
          </StyledTypo>
        </StyledBox>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          If 2 player both ready, the game will start.
        </StyledTypo>

        <StyledTypo color="red" fontSize={{ xs: 18, md: 22 }}>
          In game:
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          Players take turns choosing coordinates to reveal treasures, each turn
          has a 60-second time limit for selection.
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          The game progresses until:
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - One player quits 3 turn, leading to the opponent's victory.
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - One player collects all treasures of the opponent.
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - The game time elapses.
        </StyledTypo>

        <StyledTypo color="red" fontSize={{ xs: 18, md: 22 }}>
          End game:
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - If a player has higher points by collecting treasures or is the last
          one standing after the opponent quits, they win.
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - If the game time elapses and neither condition is met, the player
          with higher points wins.
        </StyledTypo>
        <StyledTypo fontSize={{ xs: 18, md: 22 }}>
          - In the case of equal points, the game results in a draw.
        </StyledTypo>
      </Box>
    </LayoutGame>
  );
};

export default Guide;
