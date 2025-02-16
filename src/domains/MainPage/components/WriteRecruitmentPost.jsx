import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Box,
    Button, Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // URL에서 projectId 가져오기
import api from "../../../apis/baseApi";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { position, proceedMethod, region } from "../../MainPage/components/Filter";

const WriteRecruitmentPost = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(LoginContext);
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

    const [attachments, setAttachments] = useState([]);
    const [fileDialogOpen, setFileDialogOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [tempAttachments, setTempAttachments] = useState([]);

    // 프로젝트 데이터 불러오기
    useEffect(() => {
        if (!projectId) return;  // projectId 없으면 실행 안 함

        // 기본 값 가져오기
        api.get(`/projects/${projectId}`)
            .then(response => {
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


    const handleSubmit = async () => {
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

        // ✅ postData를 생성
        try {
            // 모집글 데이터 생성
            const postData = {
                title,
                content,
                deadline,
                recruitedField,
                recruitedNumber,
                region: selectedRegion,
                proceedMethod: selectedMethod.toUpperCase(),
                user: {
                    userId: userInfo?.id || null,
                    userName: userInfo?.username || "",
                    nickName: userInfo?.nickname || "",
                },
                projectId: Number(projectId),
            };

            // 모집글 저장
            const response = await api.post("/recruitments", postData)
            console.log("response.data", response.data);
            
            const createdPostId = response.data.id;
            console.log("attachments", attachments);
            
            // 첨부파일 처리
            if (attachments.length > 0) {
                const formData = new FormData();
                const newFiles = attachments.filter(attachment => attachment.file);
                newFiles.forEach(attachment => {
                    formData.append('file', attachment.file);
                });

                if (formData.has('file')) {
                    api.post(
                        `/recruitments/${createdPostId}/attachments`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                }
            }

            alert("모집글이 성공적으로 저장되었습니다!");
            navigate(`/recruitments/${createdPostId}`);
        } catch (error) {
            console.error("저장 실패:", error);
            alert(error.response?.data?.message || "저장 중 오류가 발생했습니다.");
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            const newAttachments = Array.from(files).map(file => ({
                type: 'file',
                name: file.name,
                file
            }));
            setTempAttachments([...tempAttachments, ...newAttachments]);
        }
    };

    const handleAddUrl = () => {
        if (urlInput.trim()) {
            setTempAttachments([...tempAttachments, { type: 'url', url: urlInput }]);
            setUrlInput('');
        }
    };

    const handleRemoveTempAttachment = (index) => {
        setTempAttachments(tempAttachments.filter((_, i) => i !== index));
    };

    const handleSaveAttachments = () => {
        setAttachments([...attachments, ...tempAttachments]);
        setTempAttachments([]);
        setFileDialogOpen(false);
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
                                    <Select value={recruitedField} onChange={(e) => setRecruitedField(e.target.value)}>
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

                    {/* 첨부파일 추가 */}
                    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ textAlign: "left" }}>첨부파일</Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Button variant="outlined" onClick={() => setFileDialogOpen(true)}>
                            첨부파일 추가
                        </Button>

                        <Box sx={{ mt: 3 }}>
                            {attachments.map((item, index) => (
                                <Stack key={index} direction="row" spacing={1} alignItems="center">
                                    {item.type === 'file' ? (
                                        <Typography variant="body2">{item.name}</Typography>
                                    ) : (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                                    )}
                                </Stack>
                            ))}
                        </Box>
                    </Paper>

                    <Dialog open={fileDialogOpen} onClose={() => setFileDialogOpen(false)}>
                        <DialogTitle>첨부파일 추가</DialogTitle>
                        <DialogContent>
                            <Button variant="outlined" component="label" fullWidth startIcon={<CloudUploadIcon />}>
                                파일 선택
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            <Divider sx={{ my: 2 }} />
                            <TextField
                                fullWidth
                                label="이미지 URL 입력"
                                variant="outlined"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />
                            <Button variant="contained" fullWidth onClick={handleAddUrl} sx={{ mt: 2 }}>
                                URL 추가
                            </Button>
                            <Box sx={{ mt: 2 }}>
                                {tempAttachments.map((item, index) => (
                                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                                        {item.type === 'file' ? (
                                            <Typography variant="body2">{item.name}</Typography>
                                        ) : (
                                            <Typography variant="body2">{item.url}</Typography>
                                        )}
                                        <IconButton size="small" onClick={() => handleRemoveTempAttachment(index)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setFileDialogOpen(false)} color="primary">
                                닫기
                            </Button>
                            <Button onClick={handleSaveAttachments} color="primary">
                                저장
                            </Button>
                        </DialogActions>
                    </Dialog>

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
}


    export default WriteRecruitmentPost;

