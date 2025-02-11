import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import MypageSidebar from "./MypageSidebar";

const API_BASE_URL = "http://localhost:8080"; // ✅ 백엔드 API URL

const MypageMain = () => {
    const navigate = useNavigate();
    const userId = 2; // TODO: 로그인된 유저의 ID 가져오기

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/${userId}`);
                if (!response.ok) throw new Error("유저 정보를 가져올 수 없습니다.");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "250px", backgroundColor: "#f4f4f4", padding: "16px", borderRight: "1px solid #ccc" }}>
                <MypageSidebar user={user} />
            </Box>
            <Box sx={{ flexGrow: 1, padding: "16px", overflowY: "auto" }}>
                <Typography variant="h5">{user?.nickname}님의 마이페이지</Typography>
                <Button fullWidth onClick={() => navigate("/mypage/write")}>내가 작성한 글</Button>
                <Button fullWidth onClick={() => navigate("/mypage/portfolio")}>포트폴리오</Button>
                <Button fullWidth onClick={() => navigate("/mypage/projects")}>프로젝트</Button>
                <Button fullWidth onClick={() => navigate("/mypage/scrap")}>스크랩</Button>
            </Box>
        </Box>
    );
};

export default MypageMain;
