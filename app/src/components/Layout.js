import { Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

import useAppContext from "../hooks/useAppContext";

const Layout = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    authState: { user, logOut },
    loadingState: { setIsLoading },
  } = useAppContext();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logOut();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Box
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: `url("/assets/images/background.png"), lightgray 50%`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {user && (
        <Button
          sx={{
            position: "fixed",
            top: "3vh",
            right: "3vw",
            background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
            padding: "10px 20px",
            borderRadius: "10px",
          }}
          onClick={handleSignOut}
        >
          <Typography
            sx={{
              color: "#2E2E2E",
              fontFamily: "Luckiest Guy",
              fontWeight: "500",
              fontSize: { xs: 14, md: 18 },
            }}
          >
            Sign Out
          </Typography>
        </Button>
      )}
      <Box mb={{ xs: 4, md: 8 }}>
        <Typography
          fontFamily="'Luckiest Guy', cursive"
          fontWeight="600"
          fontSize={{ xs: 100, md: 140 }}
          align="center"
          sx={{
            WebkitTextStroke: "0.1px #D68F24",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            color: "rgba(255, 226, 89)",
            lineHeight: "1",
          }}
        >
          Gold Thief
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default Layout;
