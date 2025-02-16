import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import Cookies from "js-cookie"; 
import dayjs from "dayjs";
import api from "../../../apis/baseApi";

const ScrapsPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [scrappedRecruitments, setScrappedRecruitments] = useState([]);
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [allRecruitments, setAllRecruitments] = useState([]); // 전체 모집글 데이터
    const [tabIndex, setTabIndex] = useState(0);

    const userId = paramUserId && !isNaN(paramUserId) ? Number(paramUserId) : userInfo?.id ?? null;

    useEffect(() => {
        if (!userInfo || !userInfo.id) {
            console.warn("🔴 로그인 정보가 없음, 로그인 체크 중...");
            return;
        }

        if (!userId) {
            console.warn("🔴 유저 ID를 가져올 수 없음, 로그인 페이지로 이동");
            navigate("/login");
            return;
        }

        if (userInfo.id !== userId) {
            console.warn("👀 다른 사용자의 마이페이지로 접근 중, 포트폴리오로 이동");
            navigate(`/mypage/${userId}/portfolios`);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get(`b b /user/${userId}`);
                if (!response.ok) throw new Error("유저 데이터 불러오기 실패");
                const data = await response.data();
                console.log("[DEBUG] 유저 데이터:", data);
                setUser(data);
            } catch (error) {
                console.error("🚨 유저 정보 가져오기 실패:", error);
            }
        };

        const fetchScrappedRecruitments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/recruitments/scraps?userId=${userId}`);
                if (!response.ok) throw new Error("스크랩한 모집글 불러오기 실패");
                const data = await response.json();
                console.log("[DEBUG] 스크랩한 모집글 데이터:", data);
                setScrappedRecruitments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("🚨 스크랩한 모집글 가져오기 실패:", error);
            }
        };

        const fetchAppliedProjects = async () => {
            try {
                const accessToken = Cookies.get("accessToken");
                if (!accessToken) {
                    console.error("🚨 인증 토큰이 없음! (로그인 필요)");
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/projects/members/recruitments`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("지원한 프로젝트 불러오기 실패");

                const data = await response.json();
                console.log("[DEBUG] 내가 지원한 프로젝트 데이터:", data);
                setAppliedProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("🚨 내가 지원한 프로젝트 가져오기 실패:", error);
            }
        };

        const fetchAllRecruitments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/recruitments`);
                if (!response.ok) throw new Error("모든 모집글 불러오기 실패");
                const data = await response.json();
                console.log("[DEBUG] 모든 모집글 데이터:", data);
                setAllRecruitments(Array.isArray(data?.content) ? data.content : []);
            } catch (error) {
                console.error("🚨 모든 모집글 가져오기 실패:", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchUserData(), fetchScrappedRecruitments(), fetchAppliedProjects(), fetchAllRecruitments()]);
            setLoading(false);
        };

        fetchData();
    }, [userId, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box sx={{display: "flex", 
        minHeight: "100vh",  // ✅ 최소 높이 100vh (컨텐츠가 짧아도 사이드바 유지)
        backgroundColor: "#f9f9f9",
        alignItems: "stretch",
        borderRight: "1px solid #ccc" }}>
                <MypageSidebar user={user} />
            </Box>

            <Box sx={{ flexGrow: 1, padding: "40px" }}>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ marginBottom: "20px" }}>
                    <Tab label="📌 스크랩한 모집글" />
                    <Tab label="📢 내가 지원한 프로젝트" />
                </Tabs>

                 {/* 🔥 스크랩한 모집글 */}
                 {tabIndex === 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>📌 스크랩한 모집글</Typography>
                        {scrappedRecruitments.length === 0 ? (
                            <Typography>스크랩한 모집글이 없습니다.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {scrappedRecruitments.map((recruit, index) => {
                                    const today = dayjs().startOf("day");
                                    const deadline = recruit.deadline ? dayjs(recruit.deadline).startOf("day") : null;
                                    const daysLeft = deadline ? deadline.diff(today, "day") : null;
                                    const status = daysLeft === null ? "진행 중" : daysLeft < 0 ? "마감" : `D-${daysLeft}`;


                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
                                                onClick={() => navigate('/recruitment/${recruit.id}')}>
                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {recruit.title}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "0.875rem",
                                                            fontWeight: "bold",
                                                            color: daysLeft === null ? "blue" : daysLeft < 0 ? "red" : "blue",
                                                        }}>
                                                            {status}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ marginTop: "50px", display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#666" }}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {dayjs(recruit.createdAt).format("YYYY-MM-DD")}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                )}



                {tabIndex === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>📢 내가 지원한 프로젝트</Typography>
                        {appliedProjects.length === 0 ? (
                            <Typography>지원한 프로젝트가 없습니다.</Typography>
                        ) : (
                            <List>
                                {appliedProjects.map((project, index) => {
                                    const relatedRecruitments = allRecruitments
                                        .filter(recruitment => recruitment.projectId === project.id)
                                        .filter((recruitment, i, arr) => arr.findIndex(r => r.id === recruitment.id) === i);

                                    return (
                                        <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                                            <Typography variant="h6" fontWeight="bold">{project.name}</Typography>
                                            {relatedRecruitments.length === 0 ? (
                                                <Typography sx={{ fontSize: "14px", color: "#888" }}>관련 모집글이 없습니다.</Typography>
                                            ) : (
                                                <List>
                                                    {relatedRecruitments.map((recruitment, rIndex) => {
                                                        const today = dayjs();
                                                        const deadline = dayjs(recruitment.deadline);
                                                        const daysLeft = deadline.diff(today, "day");
                                                        const status = daysLeft < 0 ? "마감" : `D-${daysLeft}`;

                                                        return (
                                                            <ListItem 
                                                                key={rIndex} 
                                                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                                                                onClick={() => navigate(`/recruitment/${recruitment.id}`)}
                                                            >
                                                                <ListItemText 
                                                                    primary={`↳ ${recruitment.title}`}
                                                                    secondary={
                                                                        <>
                                                                            📅 작성일: {dayjs(recruitment.createdAt).format("YYYY-MM-DD")} | 
                                                                            ⏳ 마감일: {dayjs(recruitment.deadline).format("YYYY-MM-DD")} | 
                                                                            🏷 상태: <span style={{ color: daysLeft < 0 ? "red" : "blue" }}>{status}</span>
                                                                        </>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            )}
                                        </Box>
                                    );
                                })}
                            </List>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ScrapsPage;
