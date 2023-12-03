import { useEffect } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import Layout from "../../components/Layout";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  padding: "10px 100px",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  color: "#2E2E2E",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const HomeAuthenticated = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    authState: { user },
    gameState: { game, setGame },
    notiState: { setNoti },
    loadingState: { setIsLoading },
  } = useAppContext();

  const handleProfile = async () => {
    setIsLoading(true);
    try {
      navigate("/profile/");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      navigate("/create");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleJoin = async () => {
    setIsLoading(true);

    try {
      navigate("/join");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleGuide = async () => {
    setIsLoading(true);
    try {
      navigate("/guide");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (game?.status === "done") {
      setGame(null);
      setNoti(
        game?.winner
          ? game.winner === user?.id
            ? { variant: "win" }
            : { variant: "lose" }
          : { variant: "draw" }
      );
    } else setNoti(null);
  }, []);

  return (
    <Layout>
      <Box display="flex" flexDirection="column" gap={2}>
        <StyledButton onClick={handleProfile}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Profile</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handleCreate}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Create room</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handleJoin}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Join room</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handleGuide}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Guide</StyledTypo>
        </StyledButton>
      </Box>
    </Layout>
  );
};

export default HomeAuthenticated;
