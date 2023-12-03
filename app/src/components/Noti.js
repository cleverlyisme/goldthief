import { useEffect } from "react";
import { Box, Button, Typography, alpha, styled } from "@mui/material";

import { notis } from "../utils/constants";

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
  color: "#111",
  textAlign: "center",
});

const Noti = ({ noti, setNoti }) => {
  if (!noti) return null;

  const handleClose = async () => {
    try {
      setNoti(null);
    } catch (err) {
      throw new Error(err);
    }
  };

  const announce = notis.find((n) => n.variant === noti.variant);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={alpha("#000", 0.6)}
      zIndex={20}
    >
      <Box
        width={{ xs: "90vw", md: "70vw", lg: "50vw" }}
        height="45vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
        borderRadius="10px"
        sx={{ background: "rgba(255, 253, 253, 0.8)", px: 3, py: 2 }}
      >
        <Box>
          <Box component="img" src={announce.img} width={100} height={100} />
        </Box>
        <StyledTypo>{announce.title}</StyledTypo>
        <StyledTypo>{announce.text}</StyledTypo>
        <Box display="flex" justifyContent="flex-end" alignSelf="flex-end">
          <StyledButton padding="10px 20px">
            <StyledTypo onClick={handleClose}>Close</StyledTypo>
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Noti;
