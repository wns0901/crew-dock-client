import React, { useContext, useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { LoginContext } from '../../contexts/LoginContextProvider';

const LoginPage = () => {

  const { login } = useContext(LoginContext);

  const [logintForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const changeValue = (e) => {
    setLoginForm({
      ...logintForm,
      [e.target.name]: e.target.value
    });
  }

  const submitForm = (e) => {
    e.preventDefault();
    login(logintForm.username, logintForm.password);
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form noValidate autoComplete="off" onSubmit={submitForm}>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            name='username'
            fullWidth
            value={logintForm.username}
            onChange={changeValue}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            name='password'
            value={logintForm.password}
            onChange={changeValue}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Login
          </Button>
        </form>
      </Container>
    </>
  );
};

export default LoginPage;