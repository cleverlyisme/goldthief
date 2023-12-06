import { Box, CircularProgress, Typography, styled } from "@mui/material";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledTypo = styled(Typography)({
  fontFamily: "'Luckiest Guy', cursive",
  fontWeight: "500",
});

const Waiting = () => {
  const {
    gameState: {
      game: { host },
      game,
    },
  } = useAppContext();

  return (
    <LayoutGame>
      <Box
        display="flex"
        justifyContent="space-between"
        width={{ xs: "90vw", md: "80vw" }}
        height="75vh"
        flexWrap="wrap"
        borderRadius="24px"
        sx={{ background: "rgba(255, 253, 253, 0.5)", px: 3, py: 2 }}
      >
        <Box flexGrow={1}>
          <StyledTypo fontSize={{ xs: 20, md: 24 }}>
            {host?.username}
          </StyledTypo>
          <StyledTypo fontSize={{ xs: 20, md: 24 }}>
            Room: {game?.code}
          </StyledTypo>
        </Box>
        <Box maxWidth="30vw" flexGrow={1}>
          <StyledTypo textAlign="right" fontSize={{ xs: 20, md: 24 }}>
            Waiting For Your Opponent...
          </StyledTypo>
        </Box>
        <Box width="100vw" display="flex" justifyContent="center">
          <CircularProgress color="info" />
        </Box>
      </Box>
    </LayoutGame>
  );
};

export default Waiting;
