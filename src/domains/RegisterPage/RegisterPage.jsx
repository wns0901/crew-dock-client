import { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button,
  Box
} from '@mui/material';

const RegisterPage = () => {
  const [registerForm, setRegisterForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    githubUrl: '',
    notionUrl: ''
  });

  const handleChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          회원가입
        </Typography>
      </Box>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          label="이름"
          name="name"
          value={registerForm.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="닉네임"
          name="nickname"
          value={registerForm.nickname}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="이메일"
          name="email"
          type="email"
          value={registerForm.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="비밀번호"
          name="password"
          type="password"
          value={registerForm.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          value={registerForm.passwordConfirm}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="전화번호"
          name="phone"
          value={registerForm.phone}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Github URL"
          name="githubUrl"
          value={registerForm.githubUrl}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Notion URL"
          name="notionUrl"
          value={registerForm.notionUrl}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          가입하기
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;