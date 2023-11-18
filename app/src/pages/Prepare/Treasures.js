import { useState } from "react";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useSnackbar } from "notistack";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  padding: "10px 100px",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  color: "#2E2E2E",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const Treasures = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    authState: { user },
    loadingState: { setIsLoading },
    gameState: {
      game: { host, joiner },
      game,
    },
    prepareState: { coors, setCoors, treasures, setTreasures, prepareMap },
  } = useAppContext();

  const [treasureChoose, setTreasureChoose] = useState(null);

  const handleChooseTreasure = async (type) => {
    setIsLoading(true);
    try {
      if (type === treasureChoose) setTreasureChoose(null);
      else setTreasureChoose(type);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleChooseCoor = async (coordinate) => {
    setIsLoading(true);
    try {
      if (!treasureChoose) throw new Error("Please choose kind of treasure");

      if (coors.find((coor) => coor.coordinate === coordinate).typeOfTreasure) {
        setCoors(
          coors.map((coor) => {
            if (coor.coordinate === coordinate) {
              setTreasures(
                treasures.map((treasure) => {
                  if (treasure.type === coor.typeOfTreasure)
                    return { ...treasure, quantity: treasure.quantity + 1 };
                  return treasure;
                })
              );
              return { ...coor, typeOfTreasure: null };
            }
            return coor;
          })
        );

        setIsLoading(false);
        return;
      }

      if (
        treasures.find((treasure) => treasure.type === treasureChoose)
          .quantity < 1
      )
        throw new Error("You placed all the treasures");

      setCoors(
        coors.map((coor) => {
          if (coor.coordinate === coordinate)
            return { coordinate, typeOfTreasure: treasureChoose };
          return coor;
        })
      );

      setTreasures(
        treasures.map((treasure) => {
          if (treasure.type === treasureChoose)
            return { ...treasure, quantity: treasure.quantity - 1 };
          return treasure;
        })
      );
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleNextButton = async () => {
    setIsLoading(true);
    try {
      if (treasures?.find((treasure) => treasure.quantity > 0))
        throw new Error("You must place all the treasures");

      const coorsFirstTreasure = coors
        ?.filter((coor) => coor.typeOfTreasure === 1)
        .map((coor) => coor.coordinate);
      const coorsSeondTreasure = coors
        ?.filter((coor) => coor.typeOfTreasure === 2)
        .map((coor) => coor.coordinate);
      const coorsThirdTreasure = coors
        ?.filter((coor) => coor.typeOfTreasure === 3)
        .map((coor) => coor.coordinate);

      console.log({
        user,
        game,
        coorsFirstTreasure,
        coorsSeondTreasure,
        coorsThirdTreasure,
      });

      await prepareMap(user, game, {
        1: coorsFirstTreasure,
        2: coorsSeondTreasure,
        3: coorsThirdTreasure,
      });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <LayoutGame>
      <Box
        display="flex"
        flexDirection="column"
        borderRadius="24px"
        gap="20px"
        sx={{ background: "rgba(255, 253, 253, 0.5)", px: 3, pt: 2, pb: 3 }}
      >
        <Box display="flex" justifyContent="space-between">
          <StyledTypo fontSize={{ xs: 16, md: 22 }}>{user.username}</StyledTypo>
          <StyledTypo fontSize={{ xs: 16, md: 22 }}>
            {host.id === user.id ? joiner.username : host.username}
          </StyledTypo>
        </Box>
        <Box
          display="flex"
          flexDirection={{ xs: "column-reverse", sm: "row" }}
          gap="20px"
        >
          <Box
            display="flex"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            flexDirection={{ xs: "row", sm: "column" }}
            gap="20px"
          >
            {treasures.map((treasure) => (
              <Box
                key={treasure.type}
                padding="5px 15px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                  background:
                    treasure.type === treasureChoose
                      ? "rgba(255, 253, 253, 1)"
                      : "rgba(255, 253, 253, 0.6)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  "&:hover": { background: "rgba(255, 253, 253, 1)" },
                }}
                onClick={() => handleChooseTreasure(treasure.type)}
              >
                <Box
                  component="img"
                  sx={{
                    width: { xs: 30, sm: 40 },
                    height: { xs: 30, sm: 40 },
                  }}
                  src={treasure.img}
                  alt="Avatar"
                />
                <StyledTypo>{treasure.point}</StyledTypo>
              </Box>
            ))}
          </Box>
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
                  onClick={() => handleChooseCoor(coor.coordinate)}
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
      <StyledButton onClick={handleNextButton}>
        <StyledTypo>Ready</StyledTypo>
      </StyledButton>
    </LayoutGame>
  );
};

export default Treasures;
