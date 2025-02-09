import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api/users"; 

const MypageSidebar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/me`, {
                    credentials: "include", 
                });
                if (!response.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ textAlign: "center" }}>
            {/* 프로필 사진 */}
            <Avatar
                sx={{
                    width: 100,
                    height: 100,
                    margin: "auto",
                    border: "2px solid #ccc",
                }}
                src={user.profileImgUrl || "/default-profile.png"} 
                alt="프로필 사진"
            />

            {/* 닉네임, 수정 버튼 */}
            <Typography variant="h6" sx={{ mt: 2 }}>{user.nickname || "닉네임 없음"}</Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                변경
            </Button>

            {/* 정보 리스트 */}
            <List sx={{ mt: 2 }}>
                <ListItem>
                    <ListItemText primary="이메일" secondary={user.username} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="전화번호" secondary={user.phoneNumber || "미입력"} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="포지션" secondary={user.hopePosition || "미정"} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="기술 스택" secondary={user.stacks?.join(", ") || "없음"} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="소개글" secondary={user.selfIntroduction || "소개글이 없습니다."} />
                </ListItem>
            </List>

            {/* 네비게이션 */}
            <Box sx={{ mt: 3 }}>
                <Button fullWidth onClick={() => navigate("/mypage/write")}>작성 글</Button>
                <Button fullWidth onClick={() => navigate("/mypage/portfolio")}>포트폴리오</Button>
                <Button fullWidth onClick={() => navigate("/mypage/projects")}>프로젝트</Button>
                <Button fullWidth onClick={() => navigate("/mypage/scrap")}>스크랩</Button>
            </Box>
        </Box>
    );
};

export default MypageSidebar;
