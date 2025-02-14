import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Chip, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const API_BASE_URL = "http://localhost:8080";

const PortfoliosEditPage = () => {
    const navigate = useNavigate();
    const { portfolioId } = useParams();
    const { userInfo } = useContext(LoginContext);

    // ✅ portfolioId가 없으면 새 포트폴리오 생성 모드
    const isEditing = !!portfolioId;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [stacks, setStacks] = useState([]);
    const [availableStacks, setAvailableStacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStacks = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/stacks/all`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("스택 리스트 불러오기 실패");
                const data = await response.json();
                setAvailableStacks(data);
            } catch (err) {
                console.error("🚨 기술 스택 불러오기 실패:", err);
            }
        };

        // ✅ 수정 모드인 경우에만 포트폴리오 데이터를 불러옴
        if (isEditing) {
            const fetchPortfolio = async () => {
                try {
                    setLoading(true);
                    setError("");
                    const accessToken = Cookies.get("accessToken");

                    console.log(`📡 API 요청: ${API_BASE_URL}/portfolios/detail/${portfolioId}`);
                    const response = await fetch(`${API_BASE_URL}/portfolios/detail/${portfolioId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) throw new Error("포트폴리오 불러오기 실패");
                    const data = await response.json();

                    console.log("✅ 포트폴리오 데이터:", data);

                    if (!data) {
                        throw new Error(`❌ ID ${portfolioId}에 해당하는 포트폴리오 데이터를 찾을 수 없음!`);
                    }

                    setTitle(data.title || "");
                    setContent(data.content || "");
                    setStacks(data.portfolioStacks?.map(stack => stack.stackName) || []);
                } catch (err) {
                    console.error("🚨 포트폴리오 데이터 불러오기 실패:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPortfolio();
        } else {
            setLoading(false);
        }

        fetchStacks();
    }, [portfolioId, isEditing]);

    const handleSubmit = async () => {
        try {
            const accessToken = Cookies.get("accessToken");

            const portfolioData = {
                title,
                content,
                portfolioStacks: stacks.map(stackName => ({ stackName })),
                user: { id: userInfo.id }, // ✅ 새 포트폴리오 생성 시 유저 ID 추가
            };

            const url = isEditing 
                ? `${API_BASE_URL}/portfolios/${portfolioId}` // 수정
                : `${API_BASE_URL}/portfolios`; // 생성

            const method = isEditing ? "PUT" : "POST";

            console.log(`📡 API 요청: ${url} (${method})`);

            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(portfolioData),
            });

            if (!response.ok) throw new Error("포트폴리오 저장 실패");

            alert(isEditing ? "포트폴리오가 성공적으로 수정되었습니다!" : "포트폴리오가 성공적으로 생성되었습니다!");
            navigate("/mypage/portfolios");
        } catch (err) {
            console.error("🚨 포트폴리오 저장 실패:", err);
        }
    };

    // ✅ 데이터가 없을 때 예외 처리
    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Box sx={{ width: "600px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                    {isEditing ? "포트폴리오 수정" : "포트폴리오 생성"}
                </Typography>

                <TextField 
                    fullWidth 
                    label="제목" 
                    variant="outlined" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    sx={{ mt: 3 }} 
                />
                
                <TextField 
                    fullWidth 
                    label="내용" 
                    multiline 
                    rows={6} 
                    variant="outlined" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    sx={{ mt: 3 }} 
                />

                <Typography sx={{ mt: 3, mb: 1 }}>기술 스택:</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {stacks.map((stack, index) => (
                        <Chip key={index} label={stack} onDelete={() => setStacks(stacks.filter(s => s !== stack))} />
                    ))}
                    <Select
                        value=""
                        onChange={(e) => {
                            const newStack = e.target.value;
                            if (!stacks.includes(newStack)) {
                                setStacks([...stacks, newStack]);
                            }
                        }}
                        displayEmpty
                        sx={{ ml: "auto", minWidth: "150px", textAlign: "right" }}
                    >
                        <MenuItem value="" disabled>기술스택 추가</MenuItem>
                        {availableStacks
                            .filter(stack => !stacks.includes(stack)) 
                            .map((stack, index) => (
                                <MenuItem key={index} value={stack}>{stack}</MenuItem>
                            ))}
                    </Select>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {isEditing ? "수정 완료" : "생성 완료"}
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => navigate("/mypage/portfolios")}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PortfoliosEditPage;
