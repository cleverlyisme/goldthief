import { useState } from "react";
import { Box, Button, TextField, styled } from "@mui/material";
import { useSnackbar } from "notistack";

import LayoutAuth from "../../components/LayoutAuth";
import useAppContext from "../../hooks/useAppContext";

const StyledTextField = styled(TextField)({
  background: "rgba(31, 31, 31, 0.6)",
  fontFamily: "Montserrat",
  fontWeight: "700",
  borderRadius: 15,
  border: "2px solid #D68F24",
  color: "#fff",
  input: { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
});

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    loadingState: { setIsLoading },
    authState: { signUp },
  } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await signUp(email, password);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <LayoutAuth>
      <Box display="flex" flexDirection="column" gap={2}>
        <StyledTextField
          size="medium"
          label="Email"
          sx={{ width: { xs: "70vw", sm: "50vw", md: "35vw", lg: "30vw" } }}
          InputLabelProps={{
            style: {
              color: "#FF9900",
              fontWeight: 700,
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
              fontWeight: 700,
            },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          sx={{
            background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
            py: 1,
            px: 5,
            color: "#2E2E2E",
            fontFamily: "Luckiest Guy",
            fontSize: 20,
            fontWeight: "600",
            borderRadius: "15px",
          }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Box>
    </LayoutAuth>
  );
};

export default SignUp;
