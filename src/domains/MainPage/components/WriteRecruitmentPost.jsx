import React, { useState } from 'react';
import MDEditor from "@uiw/react-md-editor";
import { Grid, Container, TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip, Box } from '@mui/material';

const WriteRecruitmentPost = () => {
    const [title, setTitle] = useState();
    const [deadline, setDeadline] = useState();
    const [recruitedField, setRecruitedField] = useState();
    const [duration, setDuration] = useState();
    const [region, setRegion] = useState();
    const [proceedMethod, setProceedMethod] = useState();
    const [recruitedNumber, setRecruitedNumber] = useState();
    const [techStack, setTechStack] = useState([]);
    const [content, setContent] = useState("");

    // 스택 끌어올려와야함
    const techOptions = ["React", "JavaScript", "Node.js", "TypeScript", "Vue", "Java"];

    const handleTechStackChange = (stack) => {
        setTechStack((prev) =>
            prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
        );
    };

    const handleSubmit = () => {
        const postData = {
            title,
            nickname,
            deadline,
            recruitedField,
            duration,
            region,
            proceedMethod,
            recruitedNumber,
            techStack,
            content
        };
        console.log("모집글 데이터:", postData);
        // API 호출 또는 상태 관리 추가 가능
    };

    return (
        <div>
            <h2 style={{ textAlign: "left", marginBottom: "16px" }}>프로젝트 모집글 작성</h2>

            <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={6}>
            <TextField
                fullWidth
                label="제목"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />
            </Grid>
            </Grid>
        
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>모집 분야</InputLabel>
                        <Select value={recruitedField} onChange={(e) => setRecruitedField(e.target.value)}>
                            <MenuItem value="BACK">백엔드</MenuItem>
                            <MenuItem value="FRONT">프론트엔드</MenuItem>
                            <MenuItem value="FULLSTACK">풀스택</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

            {/* 읽기만 가능 프로젝트에서 읽어옴 */}
            <Grid item xs={4} sm={3} md={2}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>진행 기간</InputLabel>
                <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <MenuItem value="3개월">3개월</MenuItem>
                    <MenuItem value="6개월">6개월</MenuItem>
                    <MenuItem value="12개월">12개월</MenuItem>
                </Select>
            </FormControl>
            </Grid>

            <Grid item xs={4} sm={3} md={2}>
            <TextField
                fullWidth
                type="date"
                label="모집 마감일"
                variant="outlined"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
            />
            </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>지역</InputLabel>
                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <MenuItem value="SEOUL">서울</MenuItem>
                    <MenuItem value="BUSAN">부산</MenuItem>
                    <MenuItem value="ONLINE">온라인</MenuItem>
                </Select>
            </FormControl>
            </Grid>

            <Grid item xs={4} sm={3} md={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>진행 방식</InputLabel>
                <Select value={proceedMethod} onChange={(e) => setProceedMethod(e.target.value)}>
                    <MenuItem value="ONLINE">온라인</MenuItem>
                    <MenuItem value="OFFLINE">오프라인</MenuItem>
                    <MenuItem value="HYBRID">혼합</MenuItem>
                </Select>
            </FormControl>
            </Grid>

            <Grid item xs={4} sm={3} md={2}>
            <TextField
                fullWidth
                type="number"
                label="모집 인원"
                variant="outlined"
                value={recruitedNumber}
                onChange={(e) => setRecruitedNumber(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
            />
            </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
                <InputLabel sx={{ mb: 1 }}>기술 스택</InputLabel>
                {techOptions.map((stack) => (
                    <Chip
                        key={stack}
                        label={stack}
                        onClick={() => handleTechStackChange(stack)}
                        color={techStack.includes(stack) ? "primary" : "default"}
                        sx={{ mr: 1, mb: 1, cursor: "pointer" }}
                    />
                ))}
            </Box>
            

            <InputLabel sx={{ mb: 1 }}>프로젝트 소개 및 내용</InputLabel>
            <MDEditor value={content} onChange={setContent} />

            <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleSubmit}
            >
                작성 완료
            </Button>
            </Grid>
            </Grid>
        
            </div>
    );
};

export default WriteRecruitmentPost;
