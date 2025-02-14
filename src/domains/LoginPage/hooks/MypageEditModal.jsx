import React, { useState, useEffect, useContext } from "react";
import {
    Box, Button, TextField, Typography, Select, MenuItem, Chip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const API_BASE_URL = "http://localhost:8080"; 

const PortfoliosEditPage = () => {
    const navigate = useNavigate();
    const { portfolioId } = useParams(); // URL에서 portfolioId 가져오기
    const { userInfo } = useContext(LoginContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [stacks, setStacks] = useState([]);
    const [availableStacks, setAvailableStacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔍 포트폴리오 데이터 불러오기
    useEffect(() => {
        if (!portfolioId) {
            console.error("🚨 portfolioId가 undefined! URL을 확인해봐!");
            return;
        }

        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const accessToken = Cookies.get("accessToken");

                console.log(`📡 API 요청: ${API_BASE_URL}/portfolios/${portfolioId}`);

                const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("포트폴리오 불러오기 실패");
                const data = await response.json();

                console.log("📌 불러온 포트폴리오 데이터:", data);

                setTitle(data.title);
                setContent(data.content);
                setStacks(data.portfolioStacks.map(stack => stack.stackName));

                // 🔹 전체 기술 스택 가져오기
                const stackResponse = await fetch(`${API_BASE_URL}/stacks/all`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!stackResponse.ok) throw new Error("스택 리스트 불러오기 실패");
                const stackData = await stackResponse.json();
                setAvailableStacks(stackData);
            } catch (err) {
                console.error("🚨 데이터 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [portfolioId]);

    // 🔄 포트폴리오 저장 (수정 요청)
    const handleSave = async () => {
        try {
            const accessToken = Cookies.get("accessToken");
            const updatedPortfolio = {
                title,
                content,
                portfolioStacks: stacks.map(stackName => ({ stackName })),
            };

            console.log("🚀 저장할 데이터:", updatedPortfolio);

            const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPortfolio),
            });

            if (!response.ok) throw new Error("포트폴리오 수정 실패");

            console.log("✅ 포트폴리오 수정 성공!");
            navigate("/mypage/portfolios"); 
        } catch (err) {
            console.error("🚨 포트폴리오 수정 실패:", err);
        }
    };

    // 🔘 기술 스택 추가
    const handleAddStack = (event) => {
        const newStack = event.target.value;
        if (newStack && !stacks.includes(newStack)) {
            setStacks([...stacks, newStack]);
        }
    };

    // ❌ 기술 스택 삭제
    const handleRemoveStack = (stackToRemove) => {
        setStacks(stacks.filter(stack => stack !== stackToRemove));
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Box sx={{ width: "600px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: 1 }}>
                <Typography variant="h5" fontWeight="bold">포트폴리오 수정</Typography>

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
                        <Chip key={index} label={stack} onDelete={() => handleRemoveStack(stack)} />
                    ))}
                    <Select value="" onChange={handleAddStack} displayEmpty>
                        <MenuItem value="" disabled>기술스택 추가</MenuItem>
                        {availableStacks.map((stack, index) => (
                            <MenuItem key={index} value={stack}>{stack}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>완료</Button>
                    <Button variant="outlined" color="error" onClick={() => navigate("/mypage/portfolios")}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PortfoliosEditPage;
