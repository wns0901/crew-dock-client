import React, { useEffect, useState, useContext } from "react";
import Chip from "@mui/material/Chip";
import { Box, Typography, CircularProgress, Avatar, Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8080"; // ✅ 백엔드 API URL

const MypageMain = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams(); // ✅ URL에서 userId 가져오기
    const { userInfo } = useContext(LoginContext); // ✅ 로그인된 유저 정보 가져오기
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portfolios, setPortfolios] = useState([]);
    const [projects, setProjects] = useState([]);

    // ✅ `userId`가 없으면 로그인된 사용자의 ID 사용
    const userId = paramUserId || userInfo?.id;

    useEffect(() => {
        if (!userId) {
            console.warn("🔴 유저 ID를 가져올 수 없음, 로그인 페이지로 이동");
            navigate("/login");  // 🔥 로그인 안 되어 있으면 로그인 페이지로 이동
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userRes = await fetch(`${API_BASE_URL}/user/${userId}`);
                const userData = await userRes.json();
                console.log("[DEBUG] 유저 정보:", userData);
                setUser(userData);
            } catch (err) {
                console.error("❌ 유저 정보 불러오기 실패", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchPortfolios = async () => {
            try {
                const portfoliosRes = await fetch(`${API_BASE_URL}/portfolios/${userId}?row=3`);
                const portfoliosData = await portfoliosRes.json();
                console.log("[DEBUG] 포트폴리오 데이터:", portfoliosData);
                setPortfolios(portfoliosData);
            } catch (err) {
                console.error("❌ 포트폴리오 불러오기 실패", err);
            }
        };

        const fetchProjects = async () => {
            try {
                const accessToken = Cookies.get("accessToken"); // 쿠키에서 토큰 가져오기
                const response = await fetch(`${API_BASE_URL}/projects/members?row=3`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,  // ✅ 토큰 추가
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) throw new Error("프로젝트 불러오기 실패");
        
                const projectsData = await response.json();
                console.log("[DEBUG] 프로젝트 데이터:", projectsData);
                setProjects(projectsData);
            } catch (err) {
                console.error("🚨 프로젝트 불러오기 실패:", err);
            }
        };
        
        
        
        

        fetchUserData();
        fetchPortfolios();
        fetchProjects();
    }, [userId, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", height: "100vh", overflowY: "auto" }}>
            {/* ✅ 좌측 사이드바 */}
            <Box sx={{ width: "250px", backgroundColor: "#f4f4f4", padding: "16px", borderRight: "1px solid #ccc", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", top: 0, left: 0 }}>
                <MypageSidebar user={user} />
            </Box>

            {/* ✅ 메인 컨텐츠 영역 */}
            <Box sx={{ flexGrow: 1, marginLeft: "270px", marginRight: "100px", padding: "40px" }}>
                {/* 섹션 1: 일정 관리 + 작성글 */}
                <Box mb={4}>
                    <Typography variant="h6">📅 일정 관리</Typography>
                    <Box sx={{ border: "1px solid #ddd", padding: 2, borderRadius: 2, height: "300px", mb: 2 }}>
                        <Typography>캘린더 영역</Typography>
                    </Box>
                </Box>
                <Box mb={4}>
                    <Typography variant="h6">📝 작성한 글</Typography>
                    <Grid container spacing={3}>
                        {[...Array(3)].map((_, index) => (
                            <Grid item xs={4} key={index}>
                                <Box sx={{ border: "1px solid #ddd", padding: 3, borderRadius: 2, height: "120px", mb: 2 }}>
                                    <Typography>작성 글 {index + 1} 영역</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* 섹션 2: 포트폴리오 + 프로젝트 + 스크랩 */}
                <Box mb={4}>
                    <Typography variant="h6">🚀 프로젝트</Typography>
                    <Grid container spacing={3}>
                        {projects.length > 0 ? projects.map((project, index) => (
                            <Grid item xs={4} key={project.id || index}>
                                <Box sx={{ border: "1px solid #ddd", padding: 3, borderRadius: 2, height: "140px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left", mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1, mt: 3 }}>
                                        {project.name}
                                    </Typography>
                                    
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, flexWrap: "wrap", mt: "auto", pb: 1, ml: 1 }}>
                                        {project.stacks && project.stacks.map((stack) => (
                                            <Chip key={stack.id} label={`#${stack.stackName}`} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        )) : <Typography>진행 중인 프로젝트가 없습니다.</Typography>}
                    </Grid>
                </Box>

                <Box mb={4}>
                    <Typography variant="h6" >📁 포트폴리오</Typography>
                    <Grid container spacing={3}>
                        {portfolios.length > 0 ? portfolios.map((portfolio, index) => (
                            <Grid item xs={4} key={portfolio.id || index}>
                                <Box sx={{ border: "1px solid #ddd", padding: 3, borderRadius: 2, height: "140px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left", mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1, mt: 3 }}>
                                        "{portfolio.title}"
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, flexWrap: "wrap", mt: "auto", pb: 1, ml: 1 }}>
                                        {portfolio.portfolioStacks && portfolio.portfolioStacks.map((stack) => (
                                            <Chip key={stack.id} label={`#${stack.stackName}`} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        )) : <Typography>포트폴리오가 없습니다.</Typography>}
                    </Grid>
                </Box>



                <Box>
                    <Typography variant="h6">⭐ 스크랩</Typography>
                    <Grid container spacing={3}>
                        {[...Array(3)].map((_, index) => (
                            <Grid item xs={4} key={index}>
                                <Box sx={{ border: "1px solid #ddd", padding: 3, borderRadius: 2, height: "120px", mb: 2 }}>
                                    <Typography>스크랩 {index + 1} 영역</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default MypageMain;
