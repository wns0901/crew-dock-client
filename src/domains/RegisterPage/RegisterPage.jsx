import { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import {
  getStacks,
  verifyNickname,
  verifyUsername,
  verifyEmailCode,
  register
} from "../../apis/auth";
import HopePosition from "./components/HopePosition";
import StacksInput from "./components/StacksInput";
import { checkForm, lastCheck } from "./util/checkForm";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [isSendEmailCode, setIsSendEmailCode] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [stacks, setStacks] = useState([]);
  const [nickName, setNickName] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errorMsgInfo, setErrorMsgInfo] = useState({
    name: "",
    email: "",
    password: "",
    nickName: "",
    emailCode: "",
    phoneMiddle: "",
    phoneLast: "",
  });
  const [phoneNumbers, setPhoneNumbers] = useState({
    middle: "",
    last: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    nickname: "",
    username: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    githubUrl: "",
    notionUrl: "",
    hopePosition: "",
    stackIds: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    getStacks().then((res) => {
      setStacks(res.data);
    });
  }, []);

  useEffect(() => {
    if (!nickName) return;

    const debounce = setTimeout(() => {
      verifyNickname(nickName)
      .then((res) => {
        setErrorMsgInfo({ ...errorMsgInfo, nickName: "" });
      })
      .catch((err) => {
        setErrorMsgInfo({ ...errorMsgInfo, nickName: err.response.data });
      });
    }, 500);
    return () => clearTimeout(debounce);
  }, [nickName]);

  useEffect(() => {
    if (!phoneNumbers.middle && !phoneNumbers.last) return;

    const debounce = setTimeout(() => {
      checkForm.phone(phoneNumbers, errorMsgInfo, setErrorMsgInfo);
    }, 500);

    return () => clearTimeout(debounce);
  }, [phoneNumbers]);

  const handleChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailCodeChange = (e) => {
    setEmailCode(e.target.value);
  };

  const handlePhoneChange = (part) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    let newPhoneNumbers;

    if (part === "middle" && value.length <= 4) {
      newPhoneNumbers = { ...phoneNumbers, middle: value };
      setPhoneNumbers(newPhoneNumbers);
    }
    if (part === "last" && value.length <= 4) {
      newPhoneNumbers = { ...phoneNumbers, last: value };
      setPhoneNumbers(newPhoneNumbers);
    }

    setRegisterForm({
      ...registerForm,
      phone: `010-${newPhoneNumbers.middle}-${newPhoneNumbers.last}`,
    });
  };

  const handleSubmit = (e) => {
    console.log(lastCheck(registerForm, errorMsgInfo, setErrorMsgInfo));
    
    e.preventDefault();
    // 회원가입 로직 구현
    if (!lastCheck(registerForm, errorMsgInfo, setErrorMsgInfo)) return;

    const data = {
      ... registerForm,
      hopePosition: registerForm.hopePosition ? registerForm.hopePosition : null,
      githubUrl: registerForm.githubUrl ? registerForm.githubUrl : null,
      notionUrl: registerForm.notionUrl ? registerForm.notionUrl : null,
      rePassword: registerForm.passwordConfirm,
      phoneNumber: registerForm.phone,
    }
  
    register(data)
      .then((res) => {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      })
      .catch((err) => {
        alert('회원가입에 실패했습니다.');
        console.log(err);
      });
  };

  const sendEmailCode = (e) => {
    e.preventDefault();
    setIsSendingEmailCode(true);
    verifyUsername(registerForm.username)
      .then((res) => {
        setIsSendEmailCode(true);
        setErrorMsgInfo({
          ...errorMsgInfo,
          email: "",
        });
      })
      .catch((err) => {
        setErrorMsgInfo({
          ...errorMsgInfo,
          email: err.response.data,
        });
      })
      .finally(() => {
        setIsSendingEmailCode(false);
      });
  };

  const isEmailCodeMatch = () => {
    verifyEmailCode(emailCode, registerForm.username)
      .then((res) => {
        setIsEmailVerified(true);
        setErrorMsgInfo({
          ...errorMsgInfo,
          emailCode: "",
        });
        setIsEmailVerified(true);
      })
      .catch((err) => {
        setErrorMsgInfo({
          ...errorMsgInfo,
          emailCode: err.response.data,
        });
      });
  };

  const isPasswordMatch = () => {
    return (
      registerForm.password === registerForm.passwordConfirm ||
      registerForm.passwordConfirm === ""
    );
  };

  const handleNickName = (e) => {
    setNickName(e.target.value);
    handleChange(e);
  };

  const errorMsg = (msg) => {
    return (
      <Typography variant="caption" color="error">
        {msg}
      </Typography>
    );
  };

  const emailCodeCheckStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEmailVerified ? "#4caf50" : "", // isEmailVerified가 true일 때 초록색
      },
      "&:hover fieldset": {
        borderColor: isEmailVerified ? "#4caf50" : "",
      },
      "&.Mui-focused fieldset": {
        borderColor: isEmailVerified ? "#4caf50" : "",
      },
    },
  };

  const sendBtnStyle = {
    mt: "16px",
    minWidth: "100px",
    marginTop: "23px",
    height: "40px",
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
          onChange={handleNickName}
          error={!!errorMsgInfo.nickName}
        />
        {errorMsgInfo.nickName && errorMsg(errorMsgInfo.nickName)}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="이메일"
            name="username"
            type="email"
            value={registerForm.email}
            onChange={handleChange}
            error={!!errorMsgInfo.email}
          />
          <Button
            loading={isSendingEmailCode}
            variant="contained"
            sx={sendBtnStyle}
            onClick={sendEmailCode}
          >
            전송
          </Button>
        </Box>
        {errorMsgInfo.email && errorMsg(errorMsgInfo.email)}
        {isSendEmailCode && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="인증번호"
              name="emailCode"
              type="text"
              value={emailCode}
              onChange={handleEmailCodeChange}
              error={!!errorMsgInfo.emailCode}
              sx={emailCodeCheckStyle}
            />
            <Button
              variant="contained"
              sx={{
                mt: "16px",
                minWidth: "100px",
                marginTop: "23px",
                height: "40px",
              }}
              onClick={isEmailCodeMatch}
            >
              확인
            </Button>
          </Box>
        )}
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
          error={!isPasswordMatch()}
          onChange={handleChange}
        />
        {!isPasswordMatch() && errorMsg("비밀번호가 일치하지 않습니다.")}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            margin="normal"
            required
            sx={{ width: "30%" }}
            label="전화번호"
            value="010"
            disabled
          />
          <Typography sx={{ mt: 2 }}>-</Typography>
          <TextField
            margin="normal"
            required
            sx={{ width: "30%" }}
            value={phoneNumbers.middle}
            error={!!errorMsgInfo.phoneMiddle}
            onChange={handlePhoneChange("middle")}
          />
          <Typography sx={{ mt: 2 }}>-</Typography>
          <TextField
            margin="normal"
            required
            sx={{ width: "30%" }}
            value={phoneNumbers.last}
            error={!!errorMsgInfo.phoneLast}
            onChange={handlePhoneChange("last")}
          />
        </Box>
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
        <TextField
          margin="normal"
          fullWidth
          label="Blog URL"
          name="blogUrl"
          value={registerForm.blogUrl}
          onChange={handleChange}
        />

        <HopePosition
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
        />

        <StacksInput
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          stacks={stacks}
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
