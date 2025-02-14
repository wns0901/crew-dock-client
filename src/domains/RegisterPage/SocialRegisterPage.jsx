import { useState, useEffect, useContext } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import HopePosition from "./components/HopePosition";
import StacksInput from "./components/StacksInput";
import { useNavigate } from "react-router-dom";
import { verifyNickname, getStacks, socialRegister } from "../../apis/auth";
import { checkForm } from "./util/checkForm";
import Cookies from "js-cookie";
import { LoginContext } from "../../contexts/LoginContextProvider";


const SocialRegisterPage = () => {
  const {userInfo} = useContext(LoginContext);
  const [registerForm, setRegisterForm] = useState({
    nickname: "",
    phone: "",
    githubUrl: "",
    notionUrl: "",
    hopePosition: "",
    stackIds: [],
  });
  const [nickName, setNickName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState({
    middle: "",
    last: "",
  });
  const [stacks, setStacks] = useState([]);
  const [errorMsgInfo, setErrorMsgInfo] = useState({
    password: "",
    nickName: "",
    phoneMiddle: "",
    phoneLast: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const githubUrl = Cookies.get("githubUrl");
    console.log(userInfo);
    
    if (githubUrl) {
      setRegisterForm({
        ...registerForm,
        githubUrl,
      });
    }

    getStacks().then((res) => {
      setStacks(res.data);
    });
  }, []);

  useEffect(() => {
    if (!nickName) return;

    const debounce = setTimeout(() => {
      verifyNickname(nickName).catch((err) => {
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
    
    e.preventDefault();
    // 회원가입 로직 구현
    if (!!errorMsgInfo.nickName || !!errorMsgInfo.phoneLast || !!errorMsgInfo.phoneMiddle) return;

    const data = {
      ...registerForm,
      hopePosition: registerForm.hopePosition
        ? registerForm.hopePosition
        : null,
      githubUrl: registerForm.githubUrl ? registerForm.githubUrl : null,
      notionUrl: registerForm.notionUrl ? registerForm.notionUrl : null,
      phoneNumber: registerForm.phone,
      id: userInfo.id,
    };

    socialRegister(data)
      .then((res) => {
        alert("회원가입이 완료되었습니다.");
        localStorage.setItem("nickname", res.data.nickname);
        navigate("/");
      })
      .catch((err) => {
        alert("회원가입에 실패했습니다.");
        console.log(err);
      });
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          소셜 가입 추가 정보 입력
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} noValidate>
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

export default SocialRegisterPage;
