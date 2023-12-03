import { Box, Button, Grid, Typography, styled } from "@mui/material";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  color: "#2E2E2E",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const BeforeStart = () => {
  const {
    authState: { user },
    prepareState: { coors, treasures },
  } = useAppContext();

  return (
    <LayoutGame>
      <Box
        display="flex"
        flexDirection="column"
        borderRadius="24px"
        gap="20px"
        sx={{ background: "rgba(255, 253, 253, 0.5)", px: 3, pt: 2, pb: 3 }}
      >
        <Box>
          <StyledTypo fontSize={{ xs: 16, md: 22 }}>{user.username}</StyledTypo>
        </Box>
        <Box display="flex" justifyContent="center">
          <Box>
            <Grid
              container
              height={{ xs: "55vh", sm: "65vh" }}
              width={{ xs: "80vw", sm: "60vw", md: "50vw", lg: "35vw" }}
              bgcolor="rgba(255, 253, 253, 0.6)"
              borderRadius="10px"
              overflow="hidden"
            >
              {coors.map((coor) => (
                <Grid
                  item
                  xs={1.2}
                  key={coor.coordinate}
                  position="relative"
                  padding="5px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    cursor: "pointer",
                    borderRight:
                      coor.coordinate % 10 === 0 ? "none" : "1px solid #fff",
                    borderTop:
                      coor.coordinate <= 10 ? "none" : "1px solid #fff",
                    "&:hover": { background: "rgba(255, 253, 253, 1)" },
                  }}
                >
                  {coor.typeOfTreasure && (
                    <Box
                      component="img"
                      position="absolute"
                      width="25px"
                      height="25px"
                      src={
                        treasures.find(
                          (treasure) => treasure.type === coor.typeOfTreasure
                        ).img
                      }
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
      <StyledButton sx={{ padding: { xs: "10px 50px", md: "10px 100px" } }}>
        <StyledTypo>Waiting for your opponent...</StyledTypo>
      </StyledButton>
    </LayoutGame>
  );
};

export default BeforeStart;
