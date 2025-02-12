import { FormControl, FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

const StacksInput = ({registerForm, setRegisterForm, stacks}) => {

  const handleStacksChange = (event, newStacks) => {
    setRegisterForm({
      ...registerForm,
      stackIds: newStacks,
    });
  };

  const togglerBtnStyle = {
    mt: 1,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    "& .MuiToggleButton-root": {
      borderRadius: "50px",
      flex: "0 1 calc(25% - 15px)",
      mx: 0.5,
      textAlign: "center",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      "&.Mui-selected": {
        backgroundColor: "info.main",
        color: "white",
        "&:hover": {
          backgroundColor: "info.dark",
          color: "white",
        },
      },
    },
  };


  return (
    <FormControl sx={{ mt: 2, width: "100%" }}>
          <FormLabel id="stacks-button-group-label">기술 스택</FormLabel>
          <ToggleButtonGroup
            value={registerForm.stackIds}
            onChange={handleStacksChange}
            aria-label="기술 스택"
            sx={togglerBtnStyle}
            multiple
          >
            {stacks.map((stack) => (
              <ToggleButton key={stack.id} value={stack.id}>
                {stack.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
  );
};

export default StacksInput;