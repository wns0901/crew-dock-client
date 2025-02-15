import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import api from "../../../apis/baseApi";
import { 
  Grid, Container, TextField, Select, MenuItem, 
  FormControl, InputLabel, Button, Chip, Box, 
  Typography, Divider, Paper 
} from "@mui/material";
import { position, proceedMethod, region } from "../../MainPage/components/Filter";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import RecruitmentAttachmentUpload from "./RecruitmentAttachmentUpload"; 

const EditRecruitmentPost = () => {
    const { userInfo } = useContext(LoginContext);
    console.log("📌 현재 로그인된 유저 정보:", userInfo);
    const { recruitmentId } = useParams(); // URL에서 모집글 ID 가져오기
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(true);

    console.log("📌 useParams()에서 받은 recruitmentId:", recruitmentId);


    // 기존 모집글 데이터 불러오기
    useEffect(() => {
        if (!recruitmentId) return;
    
        console.log(" 현재 수정할 모집글 ID:", recruitmentId);
    
        api.get(`/recruitments/${recruitmentId}`)
            .then(response => {
                console.log("기존 모집글 데이터:", response.data);
                const postData = response.data;

                setProjectName(postData.projectName || "프로젝트명 없음"); 
                setTitle(postData.title || "");
                setDeadline(postData.deadline || "");
                setRecruitedField(postData.recruitedField || "");
                setSelectedRegion(postData.region || "");
                setSelectedMethod(postData.proceedMethod || "");
                setRecruitedNumber(postData.recruitedNumber || 1);
                setContent(postData.content || "");
                setPeriod(postData.period ? `${postData.period}개월` : "기간 없음");

                // 모집글의 프로젝트 ID를 사용해 기술 스택 조회
                if (response.data.projectId) {
                    api.get(`/projects/${response.data.projectId}/stacks`)
                        .then(res => {
                            setStacks(res.data.map(stack => stack.stackName)); //  스택 이름만 저장
                        })
                        .catch(error => console.error("❌ 프로젝트 스택 가져오기 실패:", error));
                }
    
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ 모집글 데이터 불러오기 실패:", error);
                if (error.response) {
                    console.log("❌ 서버 응답 코드:", error.response.status);
                    console.log("❌ 서버 응답 데이터:", error.response.data);
                }
                alert("모집글을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
                navigate(-1);
            });
    }, [recruitmentId, navigate]);
    

    const handleSubmit = () => {
        const postData = {
            title,
            content,
            deadline,
            recruitedField,
            recruitedNumber,
            region: selectedRegion,
            proceedMethod: selectedMethod,
            user: {
                userId: userInfo?.id || null,  
                userName: userInfo?.username || "",
                nickName: userInfo?.nickname || "",
            },
            project: {
                projectId: Number(recruitmentId),
                projectName: projectName,
                stackList: stacks, 
            },
        };

        console.log(" 수정할 모집글 데이터:", JSON.stringify(postData, null, 2));

        api.patch(`/recruitments/${recruitmentId}`, postData)
            .then(() => {
                console.log("모집글이 정상적으로 수정됨");
                alert("모집글이 성공적으로 수정되었습니다!");
                navigate(`/recruitments/${recruitmentId}`);
            })
            .catch((error) => {
                console.error(" 모집글 수정 실패:", error);
                if (error.response) {
                    console.error("백엔드 응답:", error.response.data);
                    alert(`수정 실패: ${error.response.data.message || "알 수 없는 오류 발생"}`);
                } else {
                    alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
                }
            });
    };

    return (
        <Container maxWidth="md">
        <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold", textAlign: "left" }}>
            {title} 수정
        </Typography>

        <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
            <Typography variant="h6" sx={{ textAlign: "left" }}>모집 정보</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={4}>{/* 모집 분야 */}
                    <FormControl fullWidth>
                        <InputLabel>모집 분야</InputLabel>
                        <Select value={recruitedField} onChange={(e) => setRecruitedField(e.target.value)}>
                            {position.map((item) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>{/* 진행 기간 */}
                    <TextField fullWidth label="진행 기간" variant="outlined" value={period} InputProps={{ readOnly: true }} />
                </Grid>

                <Grid item xs={4}>{/* 모집 마감일 */}
                    <TextField fullWidth type="date" label="모집 마감일" variant="outlined" value={deadline} onChange={(e) => setDeadline(e.target.value)} InputLabelProps={{ shrink: true }} />
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <Grid item xs={4}>{/* 지역 */}
                    <FormControl fullWidth>
                        <InputLabel>지역</InputLabel>
                        <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                            {region.map((item) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>{/* 진행 방식 */}
                    <FormControl fullWidth>
                        <InputLabel>진행 방식</InputLabel>
                        <Select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                            {proceedMethod.map((item) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>{/* 모집 인원 */}
                    <TextField fullWidth type="number" label="모집 인원" variant="outlined" value={recruitedNumber} onChange={(e) => setRecruitedNumber(e.target.value)} inputProps={{ min: 1 }} />
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
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "left" }}>제목</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField fullWidth label="모집글 제목" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "left" }}>소개 및 내용</Typography>
            <Divider sx={{ mb: 2 }} />
            <MDEditor value={content} onChange={setContent} style={{ height: "300px" }} />
        </Paper>

        <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>수정 완료</Button>
        </Box>
    </Container>
);
};

export default EditRecruitmentPost;
