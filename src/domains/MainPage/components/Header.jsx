import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // 🔥 화살표 아이콘 추가
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import Logo from "../asset/CrewDockLogo.png"; // 로고 이미지 경로 설정
import "../../../index.css";
import "../css/Header.css"; // ✅ CSS 파일 추가

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
        <AppBar position="static" sx={{ backgroundColor: "#ffffff", boxShadow: "none", width: "85%", marginLeft: "auto", marginRight:"auto"  }}> {/* ✅ 그림자 제거 */}
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> {/* ✅ 상단바 정렬 고정 */}
                
                {/* 로고 */}
                <IconButton edge="start" color="inherit" onClick={() => navigate("/")}>
                    <img src={Logo} alt="로고" style={{ width: 90, height: 80 }} />
                </IconButton>

                {/* 네비게이션 버튼 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}> {/* ✅ 버튼 가로 정렬 */}
                    <Button className="nav-button board-button" onClick={() => navigate("/posts")}>
                        게시판
                    </Button>
                    <Button className="nav-button project-button" onClick={() => {
                      if(!isLogin) {
                        alert("로그인이 필요합니다.")
                        navigate("/login")
                        return;
                      }
                      navigate(`/mypage/projects`)}}>
                        내 프로젝트
                    </Button>

                    {/* 로그인 상태 확인 */}
                    {isLogin ? (
                        <>
                            <Button
                                sx={{
                                    color: "#000000",
                                    display: "flex",
                                    alignItems: "center", // ✅ 김쩔미 + ▼ 아이콘 가로 정렬
                                    gap: "5px" // ✅ 이름과 화살표 간격 조절
                                }}
                                onClick={handleMenuOpen}
                            >
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontSize: "1.5rem", 
                                        color: "#000000", 
                                        fontWeight: "bold"
                                    }}
                                >
                                    {userInfo.nickname}
                                </Typography>
                                <KeyboardArrowDownIcon sx={{ fontSize: "1.5rem", color: "#000000" }} /> {/* 🔥 화살표 추가 */}
                            </Button>

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
                        <Button sx={{ color: "#000000", fontSize: "1.3em" }} onClick={() => navigate("/login")}>로그인</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
