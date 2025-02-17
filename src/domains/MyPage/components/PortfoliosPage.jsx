import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Chip, Button, Divider, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import MDEditor from "@uiw/react-md-editor"; // ✅ 마크다운 렌더링 추가
import api from "../../../apis/baseApi";

const API_BASE_URL = api.defaults.baseURL; 

const PortfoliosPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [portfolios, setPortfolios] = useState([]);
    const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);
    const userId = paramUserId && !isNaN(paramUserId) ? Number(paramUserId) : userInfo?.id ?? null;
    const isOwner = userInfo?.id === user?.id;

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
                const accessToken = Cookies.get("accessToken");
                const response = await fetch(`${API_BASE_URL}/portfolios/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("포트폴리오 불러오기 실패");
                const data = await response.json();
                setPortfolios(data.reverse());
            } catch (err) {
                console.error("🚨 포트폴리오 불러오기 실패:", err);
            }
        };

        fetchUserData();
        fetchPortfolios();
    }, [userId, navigate]);

    const togglePortfolio = (portfolioId) => {
        setExpandedPortfolioId(expandedPortfolioId === portfolioId ? null : portfolioId);
    };

    const handleDeletePortfolio = async (portfolioId) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.");
        if (!confirmDelete) return;

        try {
            const accessToken = Cookies.get("accessToken");

            const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("포트폴리오 삭제 실패");

            alert("포트폴리오가 삭제되었습니다!");
            setPortfolios(portfolios.filter(portfolio => portfolio.id !== portfolioId));
        } catch (err) {
            console.error("🚨 포트폴리오 삭제 실패:", err);
            alert("포트폴리오 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflowY: "auto" }}>
            <Box sx={{ display: "flex", flexGrow: 1, marginTop: "0px" }}>
                {/* ✅ 사이드바 */}
                <Box sx={{display: "flex", 
        minHeight: "100vh",  // ✅ 최소 높이 100vh (컨텐츠가 짧아도 사이드바 유지)
        backgroundColor: "#f9f9f9",
        alignItems: "stretch",
        borderRight: "1px solid #ccc" }}>
                    <MypageSidebar user={user} />
                </Box>

                <Box sx={{ flexGrow: 1, marginLeft: "10px", marginRight: "50px", padding: "40px" }}>
                    <Typography variant="h5" fontWeight="bold" mb={3} fontSize={30}>
                        📁 포트폴리오
                    </Typography>

                    {portfolios.length > 0 ? (
                        portfolios.map((portfolio, index) => (
                            <Box key={portfolio.id} sx={{ backgroundColor: "#c4d7f5", padding: 3, borderRadius: 2, mb: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Button
                                        variant="text"
                                        sx={{ fontSize: "1.6rem", fontWeight: "bold", textTransform: "none"  , color: "#333"}}
                                        onClick={() => togglePortfolio(portfolio.id)}
                                    >
                                        {portfolio.title}
                                    </Button>
                                    {isOwner && expandedPortfolioId === portfolio.id && (
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="medium"
                                                sx={{fontSize: "1.2rem"}}
                                                onClick={() => navigate(`/mypage/portfolios/edit/${portfolio.id}`)}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="medium"
                                                color="error"
                                                sx={{fontSize: "1.2rem"}}
                                                onClick={() => handleDeletePortfolio(portfolio.id)}
                                            >
                                                삭제
                                            </Button>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                    {portfolio.portfolioStacks && portfolio.portfolioStacks.map((stack) => (
                                        <Chip key={stack.id} label={`#${stack.stackName}`} size="medium" sx={{fontSize: "1.2rem"}} variant="outlined" />
                                    ))}
                                </Box>

                                {expandedPortfolioId === portfolio.id && (
                                    <Box sx={{ backgroundColor: "#ffffff", padding: 3, borderRadius: 2, boxShadow: 1, mt: 3,  
                                        "& img": { // ✅ 마크다운 내부 이미지 크기 조절
                                        maxWidth: "200px", // 원하는 최대 너비 설정
                                        height: "auto", // 비율 유지
                                        display: "block",
                                    } ,
                                    "& p, & h1, & h2, & h3, & h4, & h5, & h6": { // ✅ 글씨 크기 키우기
                                        fontSize: "1.3rem", // 🔥 글씨 크기 키우기 (1.2rem ~ 1.5rem 추천)
                                        lineHeight: "1.8",  // ✅ 가독성 향상을 위해 줄 간격 조절
                                    }
                                    }}>
                                        <MDEditor.Markdown source={portfolio.content} />
                                    </Box>
                                )}

                                {index < portfolios.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))
                    ) : (
                        <Typography>포트폴리오가 없습니다.</Typography>
                    )}

                    {/* ✅ 추가 버튼 (포트폴리오 생성 페이지로 이동) */}
                    {isOwner && (
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{ position: "fixed", bottom: 20, right: 20 }}
                        onClick={() => navigate("/mypage/portfolios/new")}
                    >
                        <AddIcon />
                    </Fab>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PortfoliosPage;
