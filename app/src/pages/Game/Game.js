import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useSnackbar } from "notistack";
import { Close as CloseIcon } from "@mui/icons-material";

import { defaultTreasures } from "../../utils/constants";
import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  padding: "10px 100px",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const Game = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    authState: { user },
    loadingState: { setIsLoading },
    gameState: {
      game: { host, joiner },
      game,
      chooseCoordinate,
      setCurrentWin,
    },
    prepareState: {
      coors,
      setCoors,
      opponentCoors,
      setOpponentCoors,
      treasures,
      setTreasures,
      opponentTreasures,
      setOpponentTreasures,
    },
    notiState: { setNoti },
  } = useAppContext();

  const [userPoint, setUserPoint] = useState(0);
  const [opponentPoint, setOpponentPoint] = useState(0);

  const handleChooseCoordinate = async (coordinate) => {
    setIsLoading(true);
    try {
      await chooseCoordinate(user, game, coordinate);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const loadSteps = async () => {
    try {
      const userCoorsMap = user.id === joiner?.id ? joiner?.map : host?.map;
      const opponentCoorsMap = user.id === host?.id ? joiner?.map : host?.map;

      const userCoorsLoaded = coors.map((coor) => {
        for (let key in userCoorsMap) {
          if (
            userCoorsMap.hasOwnProperty(key) &&
            userCoorsMap[key].includes(coor.coordinate)
          ) {
            return { ...coor, typeOfTreasure: parseInt(key) };
          }
        }
        return coor;
      });

      setCoors(userCoorsLoaded);

      if (game.steps) {
        for (const step of game.steps) {
          const newMapLoaded =
            user.id === step.userId
              ? opponentCoors.map((coor) => {
                  for (const key in opponentCoorsMap)
                    if (
                      step.coordinates.includes(coor.coordinate) &&
                      opponentCoorsMap[key].includes(coor.coordinate)
                    )
                      return {
                        ...coor,
                        typeOfTreasure: parseInt(key),
                        isSelected: true,
                      };

                  if (step.coordinates.includes(coor.coordinate))
                    return {
                      ...coor,
                      isSelected: true,
                    };
                  return coor;
                })
              : userCoorsLoaded.map((coor) => {
                  for (const key in userCoorsMap)
                    if (
                      step.coordinates.includes(coor.coordinate) &&
                      userCoorsMap[key].includes(coor.coordinate)
                    )
                      return {
                        ...coor,
                        typeOfTreasure: parseInt(key),
                        isSelected: true,
                      };

                  if (step.coordinates.includes(coor.coordinate))
                    return {
                      ...coor,
                      isSelected: true,
                    };
                  return coor;
                });

          let point = 0;
          if (step.userId === user.id) {
            const newTreasures = defaultTreasures.map((treasure) => {
              let newQuantity = treasure.quantity;

              newMapLoaded.forEach((coor) => {
                if (coor.typeOfTreasure === treasure.type) {
                  newQuantity = newQuantity - 1;
                  point += treasure.point;
                }
              });

              return { ...treasure, quantity: newQuantity };
            });

            setUserPoint(point);
            setOpponentTreasures(newTreasures);
            setOpponentCoors(newMapLoaded);
            console.log({ opp: newMapLoaded });
          } else {
            const newTreasures = defaultTreasures.map((treasure) => {
              let newQuantity = treasure.quantity;

              newMapLoaded.forEach((coor) => {
                if (coor.typeOfTreasure === treasure.type && coor.isSelected) {
                  newQuantity = newQuantity - 1;
                  point += treasure.point;
                }
              });

              return { ...treasure, quantity: newQuantity };
            });

            setOpponentPoint(point);
            setTreasures(newTreasures);
            setCoors(newMapLoaded);
            console.log({ user: newMapLoaded });
          }
        }
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const handleCurrentPlayerWin = async () => {
    setIsLoading(true);
    try {
      await setCurrentWin(user, game);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // loadUserCoors();
    loadSteps();
  }, []);

  // useEffect(() => {
  //   loadSteps();
  // }, [game]);

  useEffect(() => {
    if (
      !opponentTreasures[1].quantity &&
      !opponentTreasures[2].quantity &&
      !opponentTreasures[3].quantity
    )
      handleCurrentPlayerWin();
  }, [opponentTreasures]);

  return (
    <LayoutGame>
      <Box
        display="flex"
        flexDirection="column"
        borderRadius="24px"
        gap="20px"
        sx={{ background: "rgba(255, 253, 253, 0.5)", px: 3, pt: 2, pb: 3 }}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between">
            <StyledTypo
              color={user.id === game?.turn ? "#FFA751" : "#2E2E2E"}
              fontSize={{ xs: 20, md: 24 }}
            >
              {user.username}
            </StyledTypo>
            <StyledTypo color="red" fontSize={{ xs: 20, md: 24 }}>
              0:30
            </StyledTypo>
            <StyledTypo
              color={user.id !== game?.turn ? "#FFA751" : "#2E2E2E"}
              fontSize={{ xs: 20, md: 24 }}
            >
              {host.id === user.id ? joiner.username : host.username}
            </StyledTypo>
          </Box>
          <Box display="flex" justifyContent="center" gap="10px">
            <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
              {userPoint}
            </StyledTypo>
            <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
              :
            </StyledTypo>
            <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
              {opponentPoint}
            </StyledTypo>
          </Box>
        </Box>

        <Box display="flex" gap="20px">
          <Box
            display={{
              xs: user.id !== game?.turn ? "flex" : "none",
              lg: "flex",
            }}
            flexDirection="column"
            gap="20px"
          >
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
                  {coor.isSelected && (
                    <Box position="absolute">
                      <CloseIcon fontSize="large" />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" gap="20px">
              {treasures.map((treasure) => (
                <Box
                  key={treasure.type}
                  padding="5px 15px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    background: "rgba(255, 253, 253, 0.6)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    "&:hover": { background: "rgba(255, 253, 253, 1)" },
                  }}
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
                  <StyledTypo color="#2E2E2E">{treasure.quantity}</StyledTypo>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            display={{
              xs: user.id === game?.turn ? "flex" : "none",
              lg: "flex",
            }}
            flexDirection="column"
            gap="20px"
          >
            <Grid
              container
              height={{ xs: "55vh", sm: "65vh" }}
              width={{ xs: "80vw", sm: "60vw", md: "50vw", lg: "35vw" }}
              bgcolor="rgba(255, 253, 253, 0.6)"
              borderRadius="10px"
              overflow="hidden"
            >
              {opponentCoors.map((coor) => (
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
                  onClick={() => handleChooseCoordinate(coor.coordinate)}
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
                  {coor.isSelected && (
                    <Box position="absolute">
                      <CloseIcon fontSize="large" />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" gap="20px">
              {opponentTreasures.map((treasure) => (
                <Box
                  key={treasure.type}
                  padding="5px 15px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    background: "rgba(255, 253, 253, 0.6)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    "&:hover": { background: "rgba(255, 253, 253, 1)" },
                  }}
                  // onClick={() => handleChooseTreasure(treasure.type)}
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
                  <StyledTypo color="#2E2E2E">{treasure.quantity}</StyledTypo>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </LayoutGame>
  );
};

export default Game;
