import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useSnackbar } from "notistack";
import { Close as CloseIcon } from "@mui/icons-material";

import {
  defaultTreasures,
  defaultCoordinates,
  defaultTurnTime,
  defaultGameTime,
} from "../../utils/constants";
import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

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
      setWinnerGame,
      setUserTurn,
      setDrawGame,
      opponent,
      setOpponentData,
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

  const [turnTime, setTurnTime] = useState(defaultTurnTime);

  const [gameTime, setGameTime] = useState(defaultGameTime);

  const loadSteps = async () => {
    setIsLoading(true);
    try {
      const userMap = user?.id === host?.id ? host.map : joiner.map;
      const opponentMap = user?.id === host?.id ? joiner.map : host.map;

      if (game.steps) {
        const updatedUserCoors = defaultCoordinates.map((coor) => {
          for (const [treasureType, treasureCoordinates] of Object.entries(
            userMap
          )) {
            if (treasureCoordinates.includes(coor.coordinate)) {
              return {
                ...coor,
                typeOfTreasure: parseInt(treasureType),
                isSelected: false,
              };
            }
          }
          return coor;
        });

        const updatedOpponentCoors = defaultCoordinates.map((coor) => {
          let newCoor = { ...coor, isSelected: false, typeOfTreasure: null };

          for (const [treasureType, treasureCoordinates] of Object.entries(
            opponentMap
          )) {
            if (treasureCoordinates.includes(coor.coordinate)) {
              newCoor = {
                ...newCoor,
                typeOfTreasure: parseInt(treasureType),
              };
            }
          }

          return newCoor;
        });

        for (const step of game.steps) {
          const targetCoors =
            step.userId === user?.id ? updatedOpponentCoors : updatedUserCoors;

          for (const coordinate of step.coordinates) {
            const coorIndex = coordinate - 1;
            targetCoors[coorIndex] = {
              ...targetCoors[coorIndex],
              isSelected: true,
            };
          }
        }

        const userTreasures = defaultTreasures.map((treasure) => ({
          ...treasure,
        }));
        const opponentTreasures = defaultTreasures.map((treasure) => ({
          ...treasure,
        }));
        let userPoint = 0;
        let opponentPoint = 0;

        updatedUserCoors.forEach((coor) => {
          if (coor.isSelected && coor.typeOfTreasure !== null) {
            const index = coor.typeOfTreasure - 1;
            userTreasures[index].quantity -= 1;
            opponentPoint += userTreasures[index].point;
          }
        });

        updatedOpponentCoors.forEach((coor) => {
          if (coor.isSelected && coor.typeOfTreasure !== null) {
            const index = coor.typeOfTreasure - 1;
            opponentTreasures[index].quantity -= 1;
            userPoint += opponentTreasures[index].point;
          }
        });

        setTreasures(userTreasures);
        setOpponentTreasures(opponentTreasures);
        setUserPoint(userPoint);
        setOpponentPoint(opponentPoint);
        setCoors(updatedUserCoors);
        setOpponentCoors(updatedOpponentCoors);
      } else {
        const updatedUserCoors = defaultCoordinates.map((coor) => {
          for (const [treasureType, treasureCoordinates] of Object.entries(
            userMap
          )) {
            if (treasureCoordinates.includes(coor.coordinate)) {
              return {
                ...coor,
                typeOfTreasure: parseInt(treasureType),
                isSelected: false,
              };
            }
          }
          return coor;
        });

        setCoors(updatedUserCoors);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleChooseCoordinate = async (coordinate) => {
    setIsLoading(true);
    try {
      await chooseCoordinate(user, game, coordinate);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const setTimes = async () => {
    setIsLoading(true);
    try {
      const currentTime = parseInt(Math.floor(Date.now()) / 1000);
      const timeElapsedTurn = parseInt(
        currentTime - game.countdownTimeTurn.start?.seconds
      );
      const remainingTimeTurn = parseInt(
        game.countdownTimeTurn?.seconds - timeElapsedTurn
      );

      const timeElapsedGame = parseInt(
        currentTime - game.countdownTimeGame.start?.seconds
      );
      const remainingTimeGame = parseInt(
        game.countdownTimeGame?.seconds - timeElapsedGame
      );

      if (remainingTimeTurn < 0)
        if (game.turn !== user?.id) await setTurn(user.id);
        else setTurn(opponent.id);

      if (remainingTimeGame < 0) {
        if (userPoint > opponentPoint)
          await setWinnerGame(user, opponent, game);
        else if (userPoint < opponentPoint)
          await setWinnerGame(opponent, user, game);
        else await setDrawGame(user, opponent, game);
      } else {
        setTurnTime(remainingTimeTurn >= 0 ? remainingTimeTurn : 0);
        setGameTime(remainingTimeGame >= 0 ? remainingTimeGame : 0);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const checkWinner = async () => {
    setIsLoading(true);
    try {
      if (game.host.missingTurnCount >= 2) {
        const winner = user?.id === host.id ? opponent : user;
        const loser = user?.id === host.id ? user : opponent;

        await setWinnerGame(winner, loser, game);
      }

      if (game.joiner.missingTurnCount >= 3) {
        const winner = user?.id === joiner.id ? opponent : user;
        const loser = user?.id === joiner.id ? user : opponent;

        await setWinnerGame(winner, loser, game);
      }

      if (opponentTreasures.every((treasure) => treasure.quantity === 0)) {
        await setWinnerGame(user, opponent, game);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const setTurn = async (userId) => {
    setIsLoading(true);
    try {
      await setUserTurn(userId, game);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSteps();
    setTimes();
    checkWinner();
  }, [game]);

  const loadOpponentData = async () => {
    try {
      await setOpponentData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  useEffect(() => {
    loadOpponentData();
  }, []);

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
              pr={3}
              color={user.id === game?.turn ? "#fa9a3d" : "#2E2E2E"}
              fontSize={{ xs: 20, md: 24 }}
            >
              {user.username}
            </StyledTypo>

            <StyledTypo
              pl={3}
              color={user.id !== game?.turn ? "#fa9a3d" : "#2E2E2E"}
              fontSize={{ xs: 20, md: 24 }}
              textAlign="right"
            >
              {host.id === user.id ? joiner.username : host.username}
            </StyledTypo>
          </Box>

          <Box display="flex" justifyContent="center" gap="20px">
            <Box alignItems="center">
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                Game time:
              </StyledTypo>
            </Box>
            <Box display="flex" gap="10px" alignItems="center">
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                {parseInt(gameTime / 60)}
              </StyledTypo>
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                :
              </StyledTypo>
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                {parseInt(gameTime % 60)}
              </StyledTypo>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gap="10px">
            <Box display="flex" alignItems="center">
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                Turn time:
              </StyledTypo>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                {parseInt(turnTime / 60)}
              </StyledTypo>
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                :
              </StyledTypo>
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                {parseInt(turnTime % 60)}
              </StyledTypo>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gap="20px">
            <Box display="flex" alignItems="center">
              <StyledTypo color="#2E2E2E" fontSize={{ xs: 20, md: 24 }}>
                Points:
              </StyledTypo>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
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
        </Box>

        <Box display="flex" gap="20px">
          <Box
            display={{
              xs: user.id !== game?.turn ? "flex" : "none",
              lg: "flex",
            }}
            flexDirection="column"
            alignItems="center"
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
            alignItems="center"
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
                  onClick={() =>
                    user.id === game.turn &&
                    handleChooseCoordinate(coor.coordinate)
                  }
                >
                  {coor.typeOfTreasure && coor.isSelected && (
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
