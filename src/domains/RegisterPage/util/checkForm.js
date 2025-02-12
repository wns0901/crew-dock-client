export const checkForm = {
  email: (email) => {
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailReg.test(email);
  },
  password: (password) => {
    const passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
    return passwordReg.test(password);
  },

  phone: (phoneNumbers, errorMsgInfo, setErrorMsgInfo) => {
    const newErrorMsgInfo = { ...errorMsgInfo };
    if (phoneNumbers.middle.length < 4) {
      newErrorMsgInfo.phoneMiddle = "전화번호를 입력해주세요.";
    } else if (phoneNumbers.middle.length === 4) {
      newErrorMsgInfo.phoneMiddle = "";
    }

    if (phoneNumbers.last.length < 4 && !newErrorMsgInfo.phoneMiddle) {
      newErrorMsgInfo.phoneLast = "전화번호를 입력해주세요.";
    } else if (phoneNumbers.last.length === 4) {
      newErrorMsgInfo.phoneLast = "";
    }

    setErrorMsgInfo(newErrorMsgInfo);
  },
};

export const checkError = ({ name, value }, setErrorMsgInfo) => {
  switch (name) {
    case "email":
      setErrorMsgInfo({
        ...errorMsgInfo,
        email: checkForm.email(value) ? "" : "이메일 형식이 올바르지 않습니다.",
      });
      break;
    case "password":
      setErrorMsgInfo({
        ...errorMsgInfo,
        password: checkForm.password(value)
          ? ""
          : "비밀번호는 8~16자리의 영문, 숫자 조합이어야 합니다.",
      });
      break;
  }
};

export const lastCheck = (registerForm, errorMsgInfo, setErrorMsgInfo) => {
  if (Object.values(errorMsgInfo).some((value) => value)) {
    return false;
  }

  if (!registerForm.username) {
    setErrorMsgInfo({
      ...errorMsgInfo,
      username: "이메일을 입력해주세요.",
    });
    return false;
  }

  if (!registerForm.password) {
    setErrorMsgInfo({
      ...errorMsgInfo,
      password: "비밀번호를 입력해주세요.",
    });
    return false;
  }

  if (!registerForm.passwordConfirm) {
    setErrorMsgInfo({
      ...errorMsgInfo,
      passwordConfirm: "비밀번호 확인을 입력해주세요.",
    });
    return false;
  }

  if (!registerForm.nickname) {
    setErrorMsgInfo({
      ...errorMsgInfo,
      nickname: "닉네임을 입력해주세요.",
    });
    return false;
  }

  if (!registerForm.phone === "010--") {
    setErrorMsgInfo({
      ...errorMsgInfo,
      phoneMiddle: "전화번호를 입력해주세요.",
      phoneLast: "전화번호를 입력해주세요.",
    });
    return false;
  }

  return true;
};
