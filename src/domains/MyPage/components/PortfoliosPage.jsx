import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Chip, Button, Divider } from "@mui/material";
import MypageSidebar from "./MypageSidebar";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8080"; // ✅ 백엔드 API URL

const PortfoliosPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [portfolios, setPortfolios] = useState([]);
    const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);

    const userId = paramUserId || userInfo?.id;

    useEffect(() => {
        if (!userId) {
            console.warn("🔴 유저 ID를 가져올 수 없음, 로그인 페이지로 이동");
            navigate("/login");
            return;
        }

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
                setPortfolios(data);
            } catch (err) {
                console.error("🚨 포트폴리오 불러오기 실패:", err);
            }
        };

        fetchPortfolios();
    }, [userId, navigate]);

    const togglePortfolio = (portfolioId) => {
        setExpandedPortfolioId(expandedPortfolioId === portfolioId ? null : portfolioId);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflowY: "auto" }}>
            <MypageSidebar user={userInfo} />
            
            <Box sx={{ flexGrow: 1, marginLeft: "10px", padding: "40px" }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    📁 포트폴리오
                </Typography>
                
                {portfolios.length > 0 ? (
                    portfolios.map((portfolio, index) => (
                        <Box key={portfolio.id} sx={{ backgroundColor: "#e8f0ff", padding: 3, borderRadius: 2, mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Button 
                                    variant="text" 
                                    sx={{ fontSize: "1.2rem", fontWeight: "bold", textTransform: "none" }}
                                    onClick={() => togglePortfolio(portfolio.id)}
                                >
                                    {portfolio.title}
                                </Button>
                                {expandedPortfolioId === portfolio.id && (
                                    <Button variant="outlined" size="small" onClick={() => navigate(`/mypage/portfolios/edit/${portfolio.id}`)}>
                                        수정
                                    </Button>
                                )}
                            </Box>
                            
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                {portfolio.portfolioStacks && portfolio.portfolioStacks.map((stack) => (
                                    <Chip key={stack.id} label={`#${stack.stackName}`} size="small" variant="outlined" />
                                ))}
                            </Box>
                            
                            {expandedPortfolioId === portfolio.id && (
                                <Box sx={{ backgroundColor: "#ffffff", padding: 3, borderRadius: 2, boxShadow: 1, mt: 3 }}>
                                    <Typography variant="h6" fontWeight="bold">{portfolio.content}</Typography>
                                    <Typography mt={2}>{portfolio.description}</Typography>
                                </Box>
                            )}
                            
                            {index < portfolios.length - 1 && <Divider sx={{ my: 2 }} />} 
                        </Box>
                    ))
                ) : (
                    <Typography>포트폴리오가 없습니다.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default PortfoliosPage;
