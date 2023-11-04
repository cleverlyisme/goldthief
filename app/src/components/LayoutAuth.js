import { Box, Typography } from "@mui/material";

const LayoutAuth = ({ children }) => {
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

export default LayoutAuth;
