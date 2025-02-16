import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom"; // URL에서 projectId 가져오기
import MDEditor from "@uiw/react-md-editor";
import api from "../../../apis/baseApi";
import { 
  Grid, Container, TextField, Select, MenuItem, 
  FormControl, InputLabel, Button, Chip, Box, 
  Typography, Divider, Paper 
} from "@mui/material";
import { position, proceedMethod, region } from "../../MainPage/components/Filter";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { useNavigate } from "react-router-dom";

const WriteRecruitmentPost = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(LoginContext);
    console.log("현재 로그인된 유저 정보:", userInfo);
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId"); // URL에서 projectId 가져오기

    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [recruitedField, setRecruitedField] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [recruitedNumber, setRecruitedNumber] = useState(1);
    const [content, setContent] = useState("");

    // 프로젝트 정보 상태
    const [projectName, setProjectName] = useState(""); 
    const [period, setPeriod] = useState(""); 
    const [stacks, setStacks] = useState([]); 
    const [loading, setLoading] = useState(true); // 딩 상태 추가

    // 프로젝트 데이터 불러오기
    useEffect(() => {
        if (!projectId) return;  // projectId 없으면 실행 안 함

        console.log(" 현재 URL에서 가져온 projectId:", projectId); // 디버깅

        // 기본 값 가져오기
        api.get(`/projects/${projectId}`)
            .then(response => {
                console.log("프로젝트 데이터:", response.data); // 디버깅 확인

                const projectData = response.data;

                setProjectName(projectData.name || "프로젝트명 없음"); 
                setPeriod(projectData.period ? `${projectData.period}개월` : "기간 없음"); 
                setStacks(projectData.stacks ? projectData.stacks.map(s => s.stack?.name || "스택 없음") : []);

                setSelectedRegion(projectData.region || "");  
                setSelectedMethod(projectData.proceedMethod || "");  
                setRecruitedField(projectData.defaultRecruitedField || "");  
                setRecruitedNumber(projectData.recruitedNumber || 1);  
                
                setLoading(false); // 데이터 로딩 완료
            })
            .catch(error => {
                console.error("프로젝트 데이터 불러오기 실패:", error);
                setLoading(false); // 로딩 실패 시에도 로딩 상태 해제
            });
    }, [projectId]);

    
    const handleSubmit = () => {
        console.log("🔹 handleSubmit 실행됨!"); // 디버깅 로그
    
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!recruitedField) {
            alert("모집 분야를 선택해주세요.");
            return;
        }
        if (!deadline) {
            alert("모집 마감일을 선택해주세요.");
            return;
        }
        if (!selectedRegion) {
            alert("지역을 선택해주세요.");
            return;
        }
        if (!selectedMethod) {
            alert("진행 방식을 선택해주세요.");
            return;
        }
        if (recruitedNumber < 1) {
            alert("모집 인원은 최소 1명 이상이어야 합니다.");
            return;
        }
    
        console.log("🔹 proceedMethod 값 확인:", selectedMethod); // 현재 값 확인용 로그
    
        // postData를 생성
        const postData = {
            title,
            content,
            deadline,
            recruitedField,
            recruitedNumber,
            region: selectedRegion,
            proceedMethod: selectedMethod.toUpperCase(), // ENUM과 일치하도록 변환
            user: {
                userId: userInfo?.id || null,
                userName: userInfo?.username || "",
                nickName: userInfo?.nickname || "",
            },
            projectId: Number(projectId),
        };
    
        console.log("🔹 전송할 모집글 데이터:", JSON.stringify(postData, null, 2)); // 최종 JSON 확인

            api.post("/recruitments", postData)
                .then((response) => {
                    console.log("✅ 모집글 저장 성공:", response.data); // 응답 데이터 확인
                    console.log("⭐백엔드 응답 데이터:", response.data);

                    const createdPostId = response.data?.id; // 응답에서 id 추출
                    console.log("📢 생성된 모집글 ID:", createdPostId); // ID 확인

                    if (!createdPostId) {
                        console.error("❌ 생성된 ID가 없습니다. 백엔드 응답 확인 필요");
                        alert("저장이 완료되었지만, 모집글 ID를 찾을 수 없습니다.");
                        return;
                    }

                    navigate(`/recruitments/${createdPostId}`); // 올바른 ID로 이동
                })
                .catch((error) => {
                    console.error("❌ 모집글 저장 실패:", error);
                    if (error.response) {
                        console.error("📢 백엔드 응답 데이터:", error.response.data);
                        alert(`저장 실패: ${error.response.data.message || "알 수 없는 오류 발생"}`);
                    } else {
                        alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
                    }
                });

        
    };    
    

        return (
            <Container maxWidth="md">
                {/* 프로젝트 모집글 작성 제목 */}
                <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold", textAlign: "left" }}>
                    프로젝트 모집글 작성
                </Typography>
        
                {/* 프로젝트 ID가 없는 경우 예외 처리 */}
                {!projectId ? (
                    <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>
                        잘못된 접근입니다. 프로젝트를 선택해주세요.
                    </Typography>
                ) : (
                    <>
                        {/* 모집 정보 섹션 */}
                        <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
                            <Typography variant="h6" sx={{ textAlign: "left" }}>
                                모집 정보
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
        
                            <Grid container spacing={2}>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>모집 분야</InputLabel>
                                        <Select
                                            multiple
                                            value={recruitedField ? recruitedField.split(",") : []} // 문자열을 배열로 변환
                                            onChange={(e) => setRecruitedField(e.target.value.join(","))} // 배열을 문자열로 변환하여 저장
                                            renderValue={(selected) =>
                                                selected
                                                    .map(value => position.find(p => p.value === value)?.label || "알 수 없음")
                                                    .join(", ") // 선택된 값들을 문자열로 표시
                                            }
                                        >
                                            {position.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="진행 기간"
                                        variant="outlined"
                                        value={period ? period : "로딩 중..."}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
        
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="모집 마감일"
                                        variant="outlined"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
        
                            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>지역</InputLabel>
                                        <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                                            {region.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
        
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>진행 방식</InputLabel>
                                        <Select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                                            {proceedMethod.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
        
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="모집 인원"
                                        variant="outlined"
                                        value={recruitedNumber}
                                        onChange={(e) => setRecruitedNumber(e.target.value)}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
        
                        {/* 기술 스택 */}
                        <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
                            <Typography variant="h6" sx={{ textAlign: "left" }}>기술 스택</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ p: 2, minHeight: 50, border: "1px solid #ddd", borderRadius: "4px" }}>
                                {stacks.length > 0 ? (
                                    stacks.map((stackName, index) => (
                                        <Chip key={index} label={stackName} sx={{ mr: 1, mb: 1 }} />
                                    ))
                                ) : (
                                    <Typography color="error">
                                        {stacks.length === 0 ? "프로젝트 스택이 없습니다." : "로딩 중..."}
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
        
                        {/* 프로젝트 정보 */}
                        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ textAlign: "left" }}>프로젝트 정보</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TextField
                                fullWidth
                                label="프로젝트명"
                                variant="outlined"
                                value={projectName ? projectName : "로딩 중..."}
                                InputProps={{ readOnly: true }}
                            />
                        </Paper>
        
                        {/* 🔹 제목 및 내용 */}
                        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ textAlign: "left" }}>제목</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TextField 
                                fullWidth 
                                label="모집글 제목" 
                                variant="outlined" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </Paper>
        

                        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ textAlign: "left" }}>소개 및 내용</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <MDEditor value={content} onChange={setContent} style={{ height: "300px" }} />
                        </Paper>
        
                        {/* 🔹 작성 버튼 */}
                        <Box sx={{ textAlign: "right", mt: 3 }}>
                        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
                            작성 완료
                        </Button>
                    </Box>
                    </>
                )}
            </Container>
        );
        
};


export default WriteRecruitmentPost;
