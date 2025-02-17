import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Tabs, Tab } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import dayjs from "dayjs";
import api from "../../../apis/baseApi";

const API_BASE_URL = api.defaults.baseURL; 

const PostsPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [visibleCount, setVisibleCount] = useState(9);
    const [tabIndex, setTabIndex] = useState(0);

    console.log("[DEBUG] paramUserId (raw):", paramUserId);
    console.log("[DEBUG] userInfo:", userInfo);
    
    const userId = paramUserId && !isNaN(paramUserId) ? Number(paramUserId) : userInfo?.id ?? null;
    
    console.log("[DEBUG] 최종 userId:", userId);

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



        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, recruitRes, postRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/user/${userId}`),
                    fetch(`${API_BASE_URL}/recruitments/user/${userId}`),
                    fetch(`${API_BASE_URL}/posts/user/${userId}`)
                ]);

                if (!userRes.ok || !recruitRes.ok || !postRes.ok) throw new Error("데이터 불러오기 실패");

                const [userData, recruitData, postData] = await Promise.all([
                    userRes.json(), recruitRes.json(), postRes.json()
                ]);

                setUser(userData || {});
                setRecruitments(Array.isArray(recruitData) ? recruitData : []);
                setPosts(Array.isArray(postData) ? postData : []);
            } catch (err) {
                console.error("🚨 데이터 불러오기 실패:", err);
                setUser({ nickname: "닉네임 없음", position: "미등록", bio: "한줄 소개가 없습니다." });
                setRecruitments([]);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, userInfo,navigate]);

    // ✅ 무한스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
            console.log("🔽 더 많은 모집글 로드!");
            setVisibleCount((prev) => prev + 3);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* ✅ 왼쪽 사이드바 (고정 크기 적용) */}
            <Box sx={{display: "flex", 
        minHeight: "100vh",  // ✅ 최소 높이 100vh (컨텐츠가 짧아도 사이드바 유지)
        backgroundColor: "#f9f9f9",
        alignItems: "stretch",
        borderRight: "1px solid #ccc" }}>
                <MypageSidebar user={user} />
            </Box>

            {/* ✅ 오른쪽 콘텐츠 (탭 포함) */}
            <Box sx={{ flexGrow: 1, padding: "40px" }}>
                {/* 🔥 모집글 & 게시판 탭 */}
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ marginBottom: "20px" }}>
                    <Tab label="📢 모집글" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}  />
                    <Tab label="📝 커뮤니티 글" sx={{ fontSize: "1.5rem", fontWeight: "bold" }} />
                </Tabs>

                {/* 🔥 모집글 리스트 */}
                {tabIndex === 0 && (
                    <Box sx={{marginTop: "60px"}}>
                        
                        <Grid container spacing={2}>
                            {recruitments.slice(0, visibleCount).map((recruit, index) => {
                                const today = dayjs().startOf("day"); // 🔥 오늘 날짜 (시간 제거)

                                // 🔥 deadline이 존재하는지 확인 후 처리
                                let deadline = null;
                                if (recruit.deadline) {
                                    deadline = dayjs(recruit.deadline).startOf("day");
                                } else {
                                    console.warn(`[⚠️ WARNING] 모집글 ${index + 1}: ${recruit.title} -> deadline 값이 없음`);
                                }
                            
                                // 🔥 마감일이 없으면 기본값 설정
                                const daysLeft = deadline ? deadline.diff(today, "day") : null;
                                const status = daysLeft === null ? "진행 중" : daysLeft < 0 ? "마감" : `D-${daysLeft}`;
                            
                               
                            
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
                                            onClick={() => navigate(`/recruitments/${recruit.id}`)}>
                                            <CardContent>
                                                {/* 🔥 제목 & 상태 한 줄 정리 */}
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" fontSize={20}>
                                                        {recruit.title}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "1.3rem",
                                                            fontWeight: "bold",
                                                            color: daysLeft === null ? "blue" : daysLeft < 0 ? "red" : "blue",
                                                        }}
                                                    >
                                                        {status}
                                                    </Typography>
                                                </Box>
                                                    
                                                {/* 🔥 모집 날짜 & 댓글 수 */}
                                                <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "space-between", fontSize: "1.3rem", color: "#666" }}>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "1.2rem" }}>
                                                        {dayjs(recruit.createdAt).format("YYYY-MM-DD")}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "1.2rem" }}>
                                                        댓글 수 : {(recruit.comments?.length || 0)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* 🔥 게시판 리스트 */}
                {tabIndex === 1 && (
                    <Box marginTop={"60px"}>
                        
                        <Grid container spacing={2}>
                            {posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
                                            onClick={() => navigate(`/posts/${post.id}`)}>
                                            <CardContent>
                                                
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" fontSize={20}>
                                                        {post.title}
                                                    </Typography>
                                                    <Typography variant="body2" 
                                                      fontWeight="bold" 
                                                      sx={{
                                                        display: "inline-block",
                                                        padding: "4px 12px",
                                                        border: "2px solid", // 🔥 모든 카테고리에 테두리 적용
                                                        borderColor: post.category === "NONE" ? "gray" : post.category === "FORUM" ? "black" : "black",
                                                        borderRadius: "16px",
                                                        fontSize: "1.3rem",
                                                        backgroundColor: "rgba(0, 0, 0, 0.05)", // 🔥 연한 배경색 적용
                                                        color: post.category === "NONE" ? "gray" : post.category === "FORUM" ? "black" : "black",
                                                      }}>
                                                          {post.category === "NONE" ? "자유" : post.category === "FORUM" ? "Q&A" : "기타"}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#666" }}>
                                                    <Typography variant="body2" color="textSecondary"  sx={{ fontSize: "1.2rem" }}>
                                                        {dayjs(post.createdAt).format("YYYY-MM-DD")}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "1.2rem" }}>
                                                        댓글 수 : {(post.comments?.length || 0)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>게시글이 없습니다.</Typography>
                            )}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PostsPage;
