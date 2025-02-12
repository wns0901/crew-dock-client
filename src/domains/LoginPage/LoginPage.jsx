import React, { useContext, useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import DividerWithText from "./components/DividerWithText";

const LoginPage = () => {
  const { login } = useContext(LoginContext);

  const [logintForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const changeValue = (e) => {
    setLoginForm({
      ...logintForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    login(logintForm.username, logintForm.password);
  };

  const containerStyle = {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const onGoogleLogin = (e) => {
    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }/oauth2/authorization/google`;
  };

  const onGithubLogin = (e) => {
    console.log("github login");

    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }/import DividerWithText from './components/DividerWithText';
oauth2/authorization/github`;
  };
  return (
    <>
      <Container maxWidth="sm" sx={containerStyle}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          로그인
        </Typography>
        <form noValidate autoComplete="off" onSubmit={submitForm}>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            name="username"
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
            name="password"
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
            style={{ marginTop: "16px" }}
          >
            Login
          </Button>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <span>회원가입</span> | <span>비밀번호 찾기</span> <br />
            <DividerWithText content={"소셜 로그인"} />
          </div>
          <GoogleLoginButton onClick={onGoogleLogin} />
          <br />
          <GithubLoginButton onClick={onGithubLogin} />
        </form>
      </Container>
    </>
  );
};

export default LoginPage;
