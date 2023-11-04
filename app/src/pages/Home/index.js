import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import LayoutAuth from "../../components/LayoutAuth";
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

const Home = () => {
  const navigate = useNavigate();
  const {
    authState: { signInAnonymous },
    loadingState: { setIsLoading },
  } = useAppContext();

  const handlesignIn = async () => {
    setIsLoading(true);
    try {
      navigate("/signin");
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      navigate("/signup");
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  const handlesignInAnonymous = async () => {
    setIsLoading(true);
    try {
      await signInAnonymous();
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  const handleGuide = async () => {
    setIsLoading(true);
    try {
      navigate("/guide");
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  return (
    <LayoutAuth>
      <Box display="flex" flexDirection="column" gap={2}>
        <StyledButton onClick={handlesignIn}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Sign in</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handleSignUp}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Sign Up</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handlesignInAnonymous}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Play as guest</StyledTypo>
        </StyledButton>

        <StyledButton onClick={handleGuide}>
          <StyledTypo fontSize={{ xs: 15, md: 18 }}>Guid</StyledTypo>
        </StyledButton>
      </Box>
    </LayoutAuth>
  );
};

export default Home;
