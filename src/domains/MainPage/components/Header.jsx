import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../asset/CrewDockLogo.png"; // 로고 이미지 경로 설정

const Header = () => {
    const { isLogin, userInfo, logout } = useContext(LoginContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
             
                <IconButton edge="start" color="inherit" onClick={() => navigate("/")}>
    <img src={Logo} alt="로고" style={{ width: 60, height: 60 }} />  
</IconButton>


                <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 1 }}>
                   
                </Typography>

             
                <Box>
                    <Button color="inherit" onClick={() => navigate("/posts")}>게시판</Button>
                    <Button color="inherit" onClick={() => navigate(`/mypage/${userInfo.id}/ProjectsPage`)}>내 프로젝트</Button>

                    
                    {isLogin ? (
                        <>
                            <Button color="inherit" onClick={handleMenuOpen}>
                                <Typography variant="body1" sx={{ fontSize: "1.3rem" }}>
                                    {userInfo.nickname}
                                </Typography>
                            </Button>님 환영합니다.
    
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => { navigate(`/mypage/${userInfo.id}`); handleMenuClose(); }}>마이페이지</MenuItem>
                                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate("/login")}>로그인</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
