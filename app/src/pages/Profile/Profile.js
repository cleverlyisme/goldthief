import { useEffect, useId, useRef, useState } from "react";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import LayoutGame from "../../components/LayoutGame";
import useAppContext from "../../hooks/useAppContext";

const StyledTextField = styled(TextField)({
  background: "rgba(31, 31, 31, 0.6)",
  fontFamily: "Montserrat",
  fontWeight: "700",
  borderRadius: 5,
  border: "2px solid #D68F24",
  color: "#FFA751",
  input: { color: "#FFA751" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
});

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #FFE259 15.1%, #FFA751 85.42%)",
  borderRadius: "10px",
});

const StyledTypo = styled(Typography)({
  color: "#2E2E2E",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const StyledStats = styled(Typography)({
  color: "#FFA751",
  fontFamily: "Luckiest Guy",
  fontWeight: "500",
});

const Profile = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    authState: { user, updateAvatarProfile, updateUsernameProfile },
    loadingState: { setIsLoading },
    storageState: { handleUpload, handleChange, urlImage, setUrlImage },
  } = useAppContext();

  const labelRef = useRef();
  const inputId = useId();

  const [username, setUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [changingAvatar, setChangingAvatar] = useState(false);

  const handleBack = async () => {
    setIsLoading(true);
    try {
      navigate(`/`);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleChangeAvatar = async () => {
    setIsLoading(true);
    try {
      const url = await handleUpload();
      await updateAvatarProfile(user.id, url);

      setChangingAvatar(false);
      enqueueSnackbar("Updated avatar successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleChangeUsername = async () => {
    setIsLoading(true);
    try {
      await updateUsernameProfile(user.id, username);

      setEditUsername(false);
      enqueueSnackbar("Updated username successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setUsername(user.username);
    setUrlImage(user.avatar);
  }, [user]);

  return (
    <LayoutGame>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
        gap="30px"
        width={{ xs: "90vw", sm: "80vw", lg: "50vw" }}
        height="75vh"
        borderRadius="24px"
        border="5px solid #FFA751"
        color="#FFA751"
        sx={{
          background: "rgba(0, 0, 0, 0.7)",
          p: 4,
        }}
      >
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
        <Box display="flex" gap="50px">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="20px"
          >
            <Box
              component="img"
              sx={{
                width: { xs: 150, sm: 200 },
                height: { xs: 150, sm: 200 },
                borderRadius: 5,
              }}
              src={urlImage}
              alt="Avatar"
            />
            {changingAvatar ? (
              <StyledButton padding="10px" onClick={handleChangeAvatar}>
                <StyledTypo fontSize={{ xs: 14, md: 16 }}>Save</StyledTypo>
              </StyledButton>
            ) : (
              <StyledButton padding="10px">
                <label htmlFor={inputId} ref={labelRef} className="d-none" />
                <input
                  id={inputId}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    await handleChange(e);
                    setChangingAvatar(true);
                  }}
                  style={{ display: "none" }}
                />
                <StyledTypo
                  fontSize={{ xs: 14, md: 16 }}
                  onClick={() => labelRef.current?.click()}
                >
                  Edit
                </StyledTypo>
              </StyledButton>
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap="10px">
            <Typography
              fontFamily="Luckiest Guy"
              fontWeight={500}
              fontSize={{ xs: 20, sm: 24 }}
            >
              Username:
            </Typography>
            {editUsername ? (
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                gap="20px"
              >
                <StyledTextField
                  size="small"
                  value={username}
                  width="100%"
                  InputLabelProps={{
                    style: {
                      color: "#FF9900",
                      fontWeight: 1000,
                    },
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <StyledButton padding="5px 10px" onClick={handleChangeUsername}>
                  <StyledTypo fontSize={{ xs: 14, md: 16 }}>Save</StyledTypo>
                </StyledButton>
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                gap="20px"
              >
                <Typography
                  fontFamily="Luckiest Guy"
                  fontWeight={500}
                  fontSize={{ xs: 20, sm: 24 }}
                >
                  {username}
                </Typography>
                <StyledButton
                  padding="5px 10px"
                  onClick={() => setEditUsername(true)}
                >
                  <StyledTypo fontSize={{ xs: 14, md: 16 }}>Edit</StyledTypo>
                </StyledButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <StyledStats fontSize={{ xs: 20, sm: 24 }}>Statistic:</StyledStats>
          <StyledStats fontSize={{ xs: 20, sm: 24 }}>
            Total: {user.win + user.lose + user.draw}
          </StyledStats>
          <StyledStats fontSize={{ xs: 20, sm: 24 }}>
            Win: {user.win}
          </StyledStats>
          <StyledStats fontSize={{ xs: 20, sm: 24 }}>
            Lose: {user.lose}
          </StyledStats>
          <StyledStats fontSize={{ xs: 20, sm: 24 }}>
            Draw: {user.draw}
          </StyledStats>
        </Box>
      </Box>
    </LayoutGame>
  );
};

export default Profile;
