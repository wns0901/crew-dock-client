import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Chip, Select, MenuItem } from "@mui/material";
import MDEditor from "@uiw/react-md-editor"; // ✅ 마크다운 에디터
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { customCommands } from "../../../utils/mdEditorCustomImgIcon";
import api from "../../../apis/baseApi";

const API_BASE_URL = api.defaults.baseURL;   // 🔥 API URL (S3 업로드 포함)

const PortfoliosEditPage = () => {
    const navigate = useNavigate();
    const { portfolioId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const isEditing = !!portfolioId;

    const [title, setTitle] = useState(""); // ✅ 제목 상태 추가
    const [content, setContent] = useState(""); // ✅ 마크다운 내용 상태
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

        if (isEditing) {
            const fetchPortfolio = async () => {
                try {
                    setLoading(true);
                    setError("");
                    const accessToken = Cookies.get("accessToken");

                    const response = await fetch(`${API_BASE_URL}/portfolios/detail/${portfolioId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) throw new Error("포트폴리오 불러오기 실패");
                    const data = await response.json();

                    if (!data) {
                        throw new Error(`❌ ID ${portfolioId}에 해당하는 포트폴리오 데이터를 찾을 수 없음!`);
                    }

                    setTitle(data.title || ""); // ✅ 제목 불러오기
                    setContent(data.content || ""); // ✅ 마크다운 내용 불러오기
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

    // ✅ 🔥 S3 이미지 업로드 함수
    const uploadImageToS3 = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE_URL}/s3`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${Cookies.get("accessToken")}` },
                body: formData,
            });

            if (!response.ok) throw new Error("이미지 업로드 실패");
            const imageUrl = await response.text();
            return imageUrl;
        } catch (err) {
            console.error("🚨 이미지 업로드 오류:", err);
            return "";
        }
    };

    // ✅ 🔥 마크다운 에디터에서 이미지 업로드 이벤트 핸들링
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const imageUrl = await uploadImageToS3(file);
        if (imageUrl) {
            setContent((prevContent) => `${prevContent}\n![이미지 설명](${imageUrl})`);
        }
    };

    const handleSubmit = async () => {
        try {
            const accessToken = Cookies.get("accessToken");

            const portfolioData = {
                title, // ✅ 제목 저장
                content, // ✅ 마크다운 내용 저장
                portfolioStacks: stacks.map(stackName => ({ stackName })),
                user: { id: userInfo.id },
            };

            const url = isEditing 
                ? `${API_BASE_URL}/portfolios/${portfolioId}` 
                : `${API_BASE_URL}/portfolios`;

            const method = isEditing ? "PUT" : "POST";

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

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Box sx={{ width: "1500px", height: "800px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                    {isEditing ? "포트폴리오 수정" : "포트폴리오 생성"}
                </Typography>

                {/* ✅ 제목 입력 추가 */}
                <TextField
                    fullWidth
                    label="제목"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mt: 3 }}
                />

                <MDEditor
                    value={content}
                    onChange={setContent}
                    preview="live"
                    height={450}
                    commands={customCommands}
                />

               
                <Typography sx={{ mt: 3, mb: 1 , fontSize:22}}>기술 스택:</Typography>
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
                        <MenuItem value="" disabled >기술스택 추가</MenuItem>
                        {availableStacks.filter(stack => !stacks.includes(stack)).map((stack, index) => (
                            <MenuItem key={index} value={stack}>{stack}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{fontSize: "1.2rem"}}>
                        {isEditing ? "수정 완료" : "생성 완료"}
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => navigate("/mypage/portfolios")} sx={{fontSize: "1.2rem"}}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PortfoliosEditPage;
