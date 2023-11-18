import { useState } from "react";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  color: "#2E2E2E",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const StyledTextField = styled(TextField)({
  background: "rgba(31, 31, 31, 0.6)",
  fontFamily: "Montserrat",
  fontWeight: "700",
  borderRadius: 15,
  border: "2px solid #D68F24",
  input: { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
});

const SignIn = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    loadingState: { setIsLoading },
    authState: { signIn },
  } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

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
    <Layout>
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
      <Box display="flex" flexDirection="column" gap={2}>
        <StyledTextField
          size="medium"
          label="Email"
          sx={{ width: { xs: "70vw", sm: "50vw", md: "35vw", lg: "30vw" } }}
          InputLabelProps={{
            style: {
              color: "#FF9900",
              fontWeight: 1000,
            },
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledTextField
          size="medium"
          type="password"
          label="Password"
          sx={{ width: { xs: "70vw", sm: "50vw", md: "35vw", lg: "30vw" } }}
          InputLabelProps={{
            style: {
              color: "#FF9900",
              fontWeight: 1000,
            },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          sx={{
            background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
            padding: "10px 100px",
            borderRadius: "15px",
          }}
          onClick={handleSignIn}
        >
          <StyledTypo fontSize={{ xs: 16, md: 18 }}>Sign In</StyledTypo>
        </Button>
      </Box>
    </Layout>
  );
};

export default SignIn;
