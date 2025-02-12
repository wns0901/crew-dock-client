import { FormControl, FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

const HopePosition = ({registerForm, setRegisterForm}) => {

  const handlePositionChange = (event, newPosition) => {
    setRegisterForm({
      ...registerForm,
      hopePosition: newPosition,
    });
  };

  const togglerBtnStyle = {
    mt: 1,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              "& .MuiToggleButton-root": {
                borderRadius: "50px",
                flex: 1,
                mx: 0.5,
                textAlign: "center",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    color: "white",
                  },
                },
              },
  };

  return (
    <FormControl sx={{ mt: 2, width: "100%" }}>
          <FormLabel id="position-button-group-label">희망 포지션</FormLabel>
          <ToggleButtonGroup
            value={registerForm.hopePosition}
            exclusive
            onChange={handlePositionChange}
            aria-label="희망 포지션"
            sx={togglerBtnStyle}
          >
            <ToggleButton value="BACK">백엔드</ToggleButton>
            <ToggleButton value="FRONT">프론트엔드</ToggleButton>
            <ToggleButton value="FULLSTACK">풀스택</ToggleButton>
            <ToggleButton value="DESIGNER">디자이너</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
  );
};

export default HopePosition;