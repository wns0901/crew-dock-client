import React, { useEffect, useState, useContext } from "react";
import { Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Button,
    Chip, } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import api from "../../../apis/baseApi";
import MyCalendar from "./MyCalendar";

const API_BASE_URL = api.defaults.baseURL; 

const MypageMain = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portfolios, setPortfolios] = useState([]);
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [scrappedPosts, setScrappedPosts] = useState([]);
    const [combinedPosts, setCombinedPosts] = useState([]); // ✅ 추가된 useState

    console.log("[DEBUG] paramUserId (raw):", paramUserId);
    console.log("[DEBUG] userInfo:", userInfo);


    const userId = paramUserId && !isNaN(paramUserId) ? Number(paramUserId) : userInfo?.id ?? null;
    console.log("[DEBUG] paramUserId:", paramUserId);
    console.log("[DEBUG] userInfo.id:", userInfo?.id);
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

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userRes = await api.get(`/user/${userId}`);
                const userData = await userRes.data;
                console.log("[DEBUG] 유저 정보:", userData);
                setUser(userData);
            } catch (err) {
                console.error("❌ 유저 정보 불러오기 실패", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await api.get(`/posts/user/${userId}?row=3`);
                const postsData = await response.data;
                console.log("[DEBUG] 작성글 데이터:", postsData);
                setPosts(postsData);
            } catch (err) {
                console.error("🚨 작성글 불러오기 실패:", err);
            }
        };

        const fetchRecruitments = async () => {
            try {
                const response = await api.get(`/recruitments/user/${userId}?row=3`);
                const recruitmentsData = await response.data;
                console.log("[DEBUG] 모집글 데이터:", recruitmentsData);
                setRecruitments(recruitmentsData);
            } catch (err) {
                console.error("🚨 모집글 불러오기 실패:", err);
            }
        };

        const fetchPortfolios = async () => {
            try {
                const portfoliosRes = await api.get(`/portfolios/${userId}?row=3`);
                const portfoliosData = await portfoliosRes.data;
                console.log("[DEBUG] 포트폴리오 데이터:", portfoliosData);
                setPortfolios(portfoliosData);
            } catch (err) {
                console.error("❌ 포트폴리오 불러오기 실패", err);
            }
        };

        const fetchProjects = async () => {
            try {
                const accessToken = Cookies.get("accessToken");
                const response = await api.get(`/projects/members?row=3`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                const projectsData = await response.data;
                console.log("[DEBUG] 프로젝트 데이터:", projectsData);
                setProjects(projectsData);
            } catch (err) {
                console.error("🚨 프로젝트 불러오기 실패:", err);
            }
        };

        const fetchScrappedPosts = async () => {
            try {
                const response = await api.get(`/recruitments/scraps?userId=${userId}&row=3`);
                const scrappedData = await response.data;
                console.log("[DEBUG] 스크랩 데이터:", scrappedData);
                setScrappedPosts(scrappedData);
            } catch (err) {
                console.error("🚨 스크랩 불러오기 실패:", err);
            }
        };

        fetchUserData();
        fetchPosts();
        fetchRecruitments();
        fetchPortfolios();
        fetchProjects();
        fetchScrappedPosts();
    }, [userInfo, userId, navigate]);

    // ✅ combinedPosts 상태 업데이트
    useEffect(() => {
        if (posts.length === 0 && recruitments.length === 0) return;

        const mergedPosts = [...posts, ...recruitments]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        setCombinedPosts(mergedPosts);
    }, [posts, recruitments]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex",  minHeight: "100vh", minWidth: "35vh", overflowY: "auto" }}>
            {/* ✅ 좌측 사이드바 */}
            <Box sx={{display: "flex", 
        minHeight: "100vh",  // ✅ 최소 높이 100vh (컨텐츠가 짧아도 사이드바 유지)
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        minWidth: "35vh",
        alignItems: "stretch",
        borderRight: "1px solid #ccc" }} >
                <MypageSidebar user={user}></MypageSidebar>
            </Box>

            {/* ✅ 메인 컨텐츠 영역 */}
            <Box sx={{ flexGrow: 1, marginLeft: "20px", marginRight: "100px", padding: "40px" }}>
                {/* 섹션 1: 일정 관리 + 작성글 */}
                <Box mb={4}>
                    <Typography variant="h6" >📅 일정 관리</Typography>
                    <MyCalendar/>
                </Box>
                <Box mb={4}>
                  <Typography variant="h6"sx={{ cursor: "pointer", "&:hover": { color: "blue" } }}
                    onClick={() => navigate("/mypage/posts")}>📝 작성한 글 </Typography>
                    <Grid container spacing={3}>
                        {combinedPosts.length > 0 ? combinedPosts.map((post, index) => (
                            post ? (
                                <Grid item xs={4} key={index}>
                                    <Box 
                                        sx={{ 
                                            border: "1px solid #ddd", 
                                            padding: 2, 
                                            borderRadius: 2, 
                                            height: "150px", 
                                            display: "flex", 
                                            flexDirection: "column", 
                                            justifyContent: "space-between",
                                            cursor: post ? "pointer" : "default",
                                            backgroundColor: post ? "white" : "#f9f9f9",
                                            color: post ? "black" : "#bbb",
                                            "&:hover": post ? { backgroundColor: "#f9f9f9" } : {}
                                        }}
                                        onClick={() => post && navigate(post?.recruitedField ? `/recruitments/${post.id}` : `/posts/${post.id}`)}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#666" }}>
                                        
                                        <Typography variant="subtitle1" fontWeight="bold"  fontSize={20}>
                                            {post?.title ? `[${post.title}]` : "작성된 글 없음"}
                                        </Typography>
                                        <Typography sx={{ fontSize: "1.2rem"}}>
                                                {post?.recruitedField ? "모집글" : "게시글"}
                                            </Typography>
                                        </Box>    
                                    
                                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#666" }}>
                                        <Typography sx={{ fontSize: "1.2rem"}}>{post?.createdAt ? dayjs(post.createdAt).format("YYYY-MM-DD") : "-"}</Typography>
                                        <Typography sx={{ fontSize: "1.2rem"}}>
                                          댓글 수 : {(post?.comments?.length || 0) + (post?.filteredComments?.length || 0)}
                                        </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ) : null
                        )) : (
                            <Typography>작성된 글이 없습니다.</Typography>
                        )}
                    </Grid>
                </Box>



                {/* 섹션 2: 포트폴리오 + 프로젝트 + 스크랩 */}
                <Box mb={4}>
                <Typography variant="h6"sx={{ cursor: "pointer", "&:hover": { color: "blue" } }}
                 onClick={() => navigate("/mypage/projects")}>🚀 프로젝트</Typography>
                      <Grid container spacing={3}>
                          {Array.from({ length: 3 }, (_, index) => {
                              const project = projects[index];
                              return (
                                  <Grid item xs={4} key={index}>
                                      <Box
                                          sx={{
                                              border: "1px solid #ddd",
                                              padding: 3,
                                              borderRadius: 2,
                                              height: "140px",
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "space-between",
                                              cursor: project ? "pointer" : "default",
                                              backgroundColor: project ? "white" : "#f9f9f9",
                                              color: project ? "black" : "#bbb",
                                              "&:hover": project ? { backgroundColor: "#f9f9f9" } : {},
                                          }}
                                          onClick={() => project && navigate(`/projects/${project.id}`)}
                                      >
                                          <Typography variant="subtitle1" fontWeight="bold"  fontSize={20}>
                                              {project ? `"${project.name}"` : "프로젝트 없음"}
                                          </Typography>
                                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                              {project?.stacks?.map((stack) => (
                                                  <Chip key={stack.id} label={`#${stack.stackName}`} size="small" variant="outlined" sx={{
                                                    fontSize: "1.2rem"}} />
                                              ))}
                                          </Box>
                                      </Box>
                                  </Grid>
                              );
                          })}
                      </Grid>
                </Box>

                <Box mb={4}>
                <Typography variant="h6"sx={{ cursor: "pointer", "&:hover": { color: "blue" } }}
                 onClick={() => navigate("/mypage/portfolios")} >📁 포트폴리오</Typography>
                    <Grid container spacing={3}>
                        {Array.from({ length: 3 }, (_, index) => {
                            const portfolio = portfolios[index]; // 존재하는 포트폴리오 가져오기
                        
                            return (
                                <Grid item xs={4} key={index}>
                                    <Box
                                        sx={{
                                            border: "1px solid #ddd",
                                            padding: 3,
                                            borderRadius: 2,
                                            height: "140px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            cursor: portfolio ? "pointer" : "default",
                                            backgroundColor: portfolio ? "white" : "#f9f9f9",
                                            color: portfolio ? "black" : "#bbb",
                                            "&:hover": portfolio ? { backgroundColor: "#f9f9f9" } : {},
                                        }}
                                        onClick={() => portfolio && navigate(`/mypage/portfolios`)}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold"  fontSize={20}>
                                            {portfolio ? `"${portfolio.title}"` : "포트폴리오 없음"}
                                        </Typography>
                                    
                                        {/* ✅ 포트폴리오 기술 스택 표시 */}
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: "auto", pb: 1 ,fontSize: "1.3rem"}}>
                                            {portfolio?.portfolioStacks?.map((stack) => (
                                                <Chip key={stack.id} label={`#${stack.stackName}`} size="small" variant="outlined" sx={{
                                                    fontSize: "1.2rem"}}/>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>



                <Box>
                    <Typography 
                        variant="h6" 
                        sx={{ cursor: "pointer", "&:hover": { color: "blue" } }}
                        onClick={() => navigate("/mypage/scraps")}
                    >
                        ⭐ 스크랩한 모집글
                    </Typography>
                                    
                    <Grid container spacing={3}>
                        {scrappedPosts.length > 0 ? (
                            scrappedPosts.map((scrap, index) => {
                                const today = dayjs();
                                const deadline = dayjs(scrap.deadline);
                                const daysLeft = deadline.diff(today, "day"); // 🔥 남은 일 수 계산
                                const status = daysLeft < 0 ? "마감" : `D-${daysLeft}`;
                            
                                return (
                                    <Grid item xs={4} key={scrap.recruitmentScrapId}>
                                        <Box
                                            sx={{
                                                border: "1px solid #ddd",
                                                padding: 3,
                                                borderRadius: 2,
                                                height: "140px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                                "&:hover": { backgroundColor: "#f9f9f9" },
                                            }}
                                            onClick={() => navigate(`/recruitments/${scrap.recruitmentPostId}`)} // ✅ 모집글 상세 페이지 이동
                                        >
                                            {/* ✅ 제목 & 마감 여부 표시 */}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="subtitle1" fontWeight="bold"  fontSize={20}> 
                                                    {scrap.title}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "1.3rem",
                                                        fontWeight: "bold",
                                                        color: daysLeft < 0 ? "red" : "blue", // 마감이면 빨강, 진행 중이면 파랑
                                                    }}
                                                >
                                                    {status}
                                                </Typography>
                                            </Box>
                                                
                                            {/* ✅ 작성 날짜 & 댓글 수 */}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", color: "#666" }}>
                                                <Typography sx={{ fontSize: "1.2rem" }}>{dayjs(scrap.createdAt).format("YYYY-MM-DD")}</Typography>
                                                <Typography sx={{ fontSize: "1.2rem" }}>댓글 {scrap.commentCount}개</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid item xs={4}>
                                <Box
                                    sx={{
                                        border: "1px solid #ddd",
                                        padding: 3,
                                        borderRadius: 2,
                                        height: "140px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#f9f9f9",
                                        color: "#bbb",
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        스크랩한 모집글 없음
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>

            </Box>
        </Box>
    );
};

export default MypageMain;
