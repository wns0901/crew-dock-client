import Cookies from "js-cookie";
import api from "../apis/baseApi";
import * as auth from "../apis/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { createContext, useEffect, useState } from "react";
import { disconnect } from "../containers/userSocketStatusSlice";
import { connectWebSocket } from "../containers/userSocketStatusSlice";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(
    JSON.parse(localStorage.getItem("isLogin")) || false
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );
  const [chatRoomIds, setChatRoomIds] = useState(
    JSON.parse(localStorage.getItem("chatRoomIds")) || []
  );
  const [projectRoles, setProjectRoles] = useState(
    JSON.parse(localStorage.getItem("projectRoles")) || []
  );
  const [roles, setRoles] = useState(
    JSON.parse(localStorage.getItem("roles")) || {
      isMember: false,
      isAdmin: false,
    }
  );

  const [open, setOpen] = useState(false);


  const dispath = useDispatch();
  const navigate = useNavigate();

  const loginCheck = async (isAuthPage = false) => {
    const accessToken = Cookies.get("accessToken");
    let response;
    let data;

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      const expirationTime = exp * 1000;
      if (Date.now() >= expirationTime) {
        setOpen(true);
        logoutSetting();
        return;
      }
    }

    if (!accessToken) {
      logoutSetting();

      return;
    }

    if (!accessToken && isAuthPage) {
      navigate("/login");
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      response = await auth.userInfo();
    } catch (error) {
      return;
    }

    if (!response) return;

    data = response.data;

    if (data === "UNAUTHORIZED" || response.status === 401) {
      navigate("/login");
      return;
    }

    loginSetting(accessToken);
  };

  useEffect(() => {
    loginCheck();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await auth.login(username, password);
      const { status, headers } = response;
      const { authorization } = headers;

      const accessToken = authorization.replace("Bearer ", "");

      if (status === 200) {
        Cookies.set("accessToken", accessToken);
        console.log("로그인 성공");
        loginCheck();

        navigate("/");
      }
    } catch (error) {
      alert("로그인 실패");
    }
  };

  const logout = (force = false) => {
    if (force) {
      logoutSetting();

      navigate("/");
      return;
    }

    if (window.confirm("로그아웃하시겠습니까?")) {
      logoutSetting();

      navigate("/");
    }
  };

  const loginSetting = (accessToken) => {
    const { id, nickname, username, role, chatRoomIds } =
      jwtDecode(accessToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const updateProjectRoles = [];
    const updateUserInfo = { id, username, nickname };
    const updatedRoles = { isMember: false, isAdmin: false, project: [] };

    role.split(",").forEach((role) => {
      if (role === "ROLE_MEMBER") updatedRoles.isMember = true;
      if (role === "ROLE_ADMIN") updatedRoles.isAdmin = true;
      if (role.startsWith("PROJECT")) {
        const [_, projectId, projectRole] = role.split("_");
        const roleObject = {
          isCaptain: false,
          isCrew: false,
          isWaiting: false,
        };

        if (projectRole === "CAPTAIN")
          roleObject.isCaptain = roleObject.isCrew = true;
        if (projectRole === "CREW") roleObject.isCrew = true;
        if (projectRole === "WAITING") roleObject.isWaiting = true;

        updateProjectRoles.push({
          projectId: parseInt(projectId),
          role: roleObject,
        });
      }
    });

    setIsLogin(true);
    setRoles(updatedRoles);
    setChatRoomIds(chatRoomIds);
    setUserInfo(updateUserInfo);
    setProjectRoles(updateProjectRoles);

    dispath(
      connectWebSocket({ roomIds: chatRoomIds, userId: updateUserInfo.id })
    );

    localStorage.setItem("isLogin", "true");
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
    localStorage.setItem("chatRoomIds", JSON.stringify(chatRoomIds));
    localStorage.setItem("userInfo", JSON.stringify(updateUserInfo));
    localStorage.setItem("projectRoles", JSON.stringify(projectRoles));
  };

  const logoutSetting = () => {
    setRoles(null);
    setIsLogin(false);
    setUserInfo(null);
    setChatRoomIds([]);
    setProjectRoles([]);

    Cookies.remove("accessToken");
    api.defaults.headers.common.Authorization = undefined;

    dispath(disconnect());

    localStorage.removeItem("roles");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("chatRoomIds");
    localStorage.removeItem("projectRoles");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        userInfo,
        roles,
        loginCheck,
        login,
        logout,
        projectRoles,
        chatRoomIds,
      }}
    >
      {children}

      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"세션 만료"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          로그인 토큰이 만료되었습니다. 다시 로그인해주세요.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>

    </LoginContext.Provider>
  );
};

export default LoginContextProvider;