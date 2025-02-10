import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../apis/baseApi"
import * as auth from "../apis/auth";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({children}) => {

  const [isLogin, setIsLogin] = useState(JSON.parse(localStorage.getItem('isLogin')) || false);

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});

  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('roles')) || { isMember: false, isAdmin: false });

  const [projectRoles, setProjectRoles] = useState(JSON.parse(localStorage.getItem('projectRoles')) || []);

  const navigate = useNavigate();

  const loginCheck = async (isAuthPage = false) => {
    
    const accessToken = Cookies.get("accessToken");
    let response;
    let data;

    if (!accessToken) {
      logoutSetting();

      return;
    }

    if (!accessToken && isAuthPage) {
      navigate("/login");
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // try {
    //   response = await auth.userInfo();
    // } catch (error) {
    //   return;
    // }

    // if (!response) return;

    // data = response.data;

    // if (data === "UNAUTHORIZED" || response.status === 401) {
    //   navigate("/login")
    //   return;
    // }

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

        loginCheck();

        navigate("/");
      }
    } catch (error) {
      alert("로그인 실패");
    }
  };

  const logout = (force = false) => {
    if(force) {
      logoutSetting();

      navigate('/');
      return;
    }

    if (window.confirm("로그아웃하시겠습니까?")) {
      logoutSetting();

      navigate('/');
    }


  };

  const loginSetting = (accessToken) => {
    const { id, nickname, username, role } = jwtDecode(accessToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setIsLogin(true);

    const updateUserInfo = { id, username, nickname };
    setUserInfo(updateUserInfo);

    const updatedRoles = { isMember: false, isAdmin: false, project: [] };
    const updateProjectRoles = [];

    role.split(",").forEach((role) => {
      if (role === "ROLE_MEMBER") updatedRoles.isMember = true;
      if (role === "ROLE_ADMIN") updatedRoles.isAdmin = true;
      if (role.startsWith("PROJECT")) {
        const [_, projectId, projectRole] = role.split("_");
        const roleObject = { isCaptain: false, isCrew: false, isWaiting: false };
        if (projectRole === "CAPTAIN") roleObject.isCaptain = roleObject.isCrew = true;
        if (projectRole === "CREW") roleObject.isCrew = true;
        if (projectRole === "WAITING") roleObject.isWaiting = true;

        updateProjectRoles.push({ projectId: parseInt(projectId), role: roleObject });
      }
    });

    setRoles(updatedRoles);
    setProjectRoles(updateProjectRoles);

    localStorage.setItem("isLogin", "true");
    localStorage.setItem('userInfo', JSON.stringify(updateUserInfo));
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
    localStorage.setItem('projectRoles', JSON.stringify(projectRoles));

  };

  const logoutSetting = () => {
    setIsLogin(false);
    setUserInfo(null);
    setRoles(null);
    setProjectRoles([]);

    Cookies.remove("accessToken");
    api.defaults.headers.common.Authorization = undefined;


    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('projectRoles');
  };

  return (
  <LoginContext.Provider value={{isLogin, userInfo, roles, loginCheck, login, logout, projectRoles}}>
    {children}
  </LoginContext.Provider>);
};

export default LoginContextProvider;
