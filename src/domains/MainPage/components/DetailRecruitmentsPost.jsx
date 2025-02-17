import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../apis/baseApi";
import {
    Grid, Container, TextField, Select, MenuItem,
    FormControl, InputLabel, Button, Box,
    Typography, Divider, Paper, Chip,
    Stack
} from "@mui/material";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { region, position, proceedMethod } from "../components/Filter"
import RecruitmentComment from "./RecruitmentComment"; // 
import Comment from "./comment/Comment";
import { useDispatch } from "react-redux";
import { makeChatRoom } from "../../../containers/userSocketStatusSlice"; 


const DetailRecruitmentPost = () => {
    const { userInfo, isLogin } = useContext(LoginContext);
    const { recruitmentsId } = useParams(); // URL에서 모집글 ID 가져오기
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [stacks, setStacks] = useState([]); // 스택
    const [loading, setLoading] = useState(true);
    const [attachments, setAttachments] = useState([]);
    const dispath = useDispatch();

    useEffect(() => {
        if (!recruitmentsId) return;

        api.get(`/recruitments/${recruitmentsId}`)
            .then(response => {
                console.log("⭐백엔드 응답 데이터:", response.data);
                setPost(response.data);
                setLoading(false);

                // ✅ 모집글의 프로젝트 ID를 사용해 기술 스택 조회
                if (response.data.projectId) {
                    api.get(`/projects/${response.data.projectId}/stacks`)
                        .then(res => {
                            setStacks(res.data.map(stack => stack.stackName)); // ✅ 스택 이름만 저장
                        })
                        .catch(error => console.error("❌ 프로젝트 스택 가져오기 실패:", error));
                }
            })
            .catch(error => {
                console.error("❌ 모집글 상세 불러오기 실패:", error);
                setLoading(false);
            });
        api.get(`/recruitments/${recruitmentsId}/attachments`)
            .then(res => setAttachments(res.data))
            .catch(error => console.error("❌ 첨부 파일 가져오기 실패:", error));
    }, []);

    if (loading) {
        return <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>로딩 중...</Typography>;
    }

    if (!post) {
        return <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>모집글을 찾을 수 없습니다.</Typography>;
    }

    const isAuthor = userInfo?.id === post.user?.userId; //작성자인지 확인

    // 모집글 삭제
    const handleDelete = () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        api.delete(`/recruitments/${recruitmentsId}`)
            .then(() => {
                alert("모집글이 삭제되었습니다.");
                navigate("/");
            })
            .catch(error => {
                console.error("❌ 모집글 삭제 실패:", error);
                alert("삭제 실패: " + (error.response?.data?.message || "알 수 없는 오류 발생"));
            });
    };

    // 모집글 수정 페이지로 이동
    const handleEdit = () => {
        navigate(`/recruitments/edit/${recruitmentsId}`);
    };

    const handleChatBtn = () => {
        console.log("채팅 버튼 클릭");
        
        if (!isLogin) {
            alert("로그인이 필요합니다.");
            return;
        }

        dispath(makeChatRoom({ senderId: userInfo.id, receiverId: post.user.userId }));
    };
    
    
    const handleApply = () => {
        if (!userInfo) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        if (!post || !post.projectId) {
            alert("프로젝트 ID를 찾을 수 없습니다.");
            return;
        }
    
        api.post(`/projects/${post.projectId}/members`, { userId: userInfo.id })
            .then(response => {
                console.log("📌 [DEBUG] 신청 응답:", response.data);
                const { message, projectId, userId, status } = response.data;
    
                alert(`${message} (프로젝트 ID: ${projectId}, 사용자 ID: ${userId}, 상태: ${status})`);
            })
            .catch(error => {
                if (error.response) {
                    console.error("❌ [ERROR] 신청 실패:", error.response.data);
                    alert("신청 실패: " + (error.response.data.error || "알 수 없는 오류"));
                } else {
                    alert("신청 중 오류가 발생했습니다.");
                }
            });
    };
    

    const handleDownloadAttachment = (attachmentId, fileName) => {
        try {
            const response = api.get(`recruitments/${recruitmentsId}/attachments`,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('첨부파일 다운로드 실패:', error);
        }
    };


            api.post(`/projects/${post.projectId}/members`, { userId: userInfo.id })
                .then(response => {
                    alert("프로젝트를 신청하셨습니다.");
                })
                .catch(error => {
                    if (error.response) {
                        const errorMessage = error.response.data.error;
                        
                        if (errorMessage === "이미 소속된 프로젝트입니다.") {
                            alert("이미 해당 프로젝트의 멤버로 소속되어 있습니다.");
                        } else if (errorMessage === "이미 지원한 프로젝트입니다.") {
                            alert("이미 지원한 프로젝트입니다.");
                        } else {
                            alert("신청 중 오류가 발생했습니다.");
                        }
                    } else {
                        alert("서버 오류가 발생했습니다.");
                    }
                });
        };
        
    

    return (
        <Container maxWidth="md">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {post.title}
                </Typography>

                {isAuthor ? (
                    // ✅ 작성자일 경우: 수정 & 삭제 버튼 표시
                    <Box>
                        <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={handleEdit}>
                            수정
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            삭제
                        </Button>
                    </Box>
                ) : (
                    // 🔹 로그인한 사용자만 "채팅", "신청" 버튼 표시
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        sx={{ mr: 1 }} 
                        onClick={() => {
                            if (!isLogin) {
                                alert("로그인이 필요합니다.");
                                return;
                            }
                            handleChatBtn
                        }}
                    >
                        채팅
                    </Button>

                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => {
                            if (!isLogin) {
                                alert("로그인이 필요합니다.");
                                return;
                            }
                            handleApply();
                        }}
                    >
                        신청
                    </Button> 
                </Box>
                )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography 
                variant="body1" 
                marginTop={-1} 
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/mypage/${post.user?.userId}`)} >
                {post.user?.nickName ?? "알 수 없음"}
            </Typography>
            <Typography variant="body1" marginTop={-1}>
                {post.createdAt ?? "알 수 없음"}
            </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
                <Typography variant="h6" sx={{ textAlign: "left" }}>모집 정보</Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                {/* 모집 분야 */}
                <Grid item xs={4}>
                <Box sx={{
                    position: "relative",  // 제목을 박스 내부에서 배치
                    border: "1px solid #ccc",  // 테두리 유지
                    borderRadius: "5px",       // 둥근 모서리
                    padding: "16px 20px 8px",  // 내부 여백 조정 (제목과 값 간격 확보)
                    minHeight: "30px",         // TextField 높이와 동일하게 설정
                    display: "flex",
                    alignItems: "center",
                }}>
                    {/* 제목 */}
                    <Typography 
                    variant="caption" 
                    color="textSecondary" 
                    sx={{ 
                        position: "absolute", 
                        top: "-8px", left: "7px", 
                        backgroundColor: "white",  // 배경 흰색으로 해서 테두리와 분리
                        padding: "0 4px", 
                        fontSize: "12px" 
                    }}
                    >
                    모집 분야
                    </Typography>
                    <Typography variant="body1" marginTop={-1}>
            {
                post.recruitedField
                    ?.split(",") // 문자열을 배열로 변환
                    .map(value => position.find(p => p.value === value)?.label || "알 수 없음") // label 찾기
                    .join(", ") // 배열을 문자열로 변환하여 출력
            }
        </Typography>
                </Box>
                </Grid>

                    <Grid item xs={4}>
                        <TextField fullWidth label="진행 기간"
                            variant="outlined" value={post.period ? post.period : "없음"}
                            InputProps={{ readOnly: true }} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField fullWidth type="date" label="모집 마감일"
                            variant="outlined" value={post.deadline}
                            InputProps={{ readOnly: true }} />
                    </Grid>

                    {/* 지역/진행방식/모집인원 */}
                    <Grid item xs={4}>
                        <TextField fullWidth label="지역"
                            variant="outlined" value={region.find(r => r.value === post.region)?.label || "알 수 없음"}
                            InputProps={{ readOnly: true }} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField fullWidth label="진행 방식"
                            value={proceedMethod.find(p => p.value === post.proceedMethod)?.label || "알 수 없음"}
                            InputProps={{ readOnly: true }} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField fullWidth label="모집 인원"
                            id="standard-disabled"
                            variant="outlined"
                            value={post.recruitedNumber}
                            InputProps={{ readOnly: true }} />
                    </Grid>

                </Grid>
            </Paper>

            {/* 🔹 기술 스택 추가 */}
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

            {/* 🔹 프로젝트 정보 */}
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ textAlign: "left" }}>프로젝트 정보</Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField fullWidth label="프로젝트명" variant="outlined" value={post.projectName} InputProps={{ readOnly: true }} />
            </Paper>
            <Divider sx={{ mb: 2 }} />

            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ textAlign: "left" }}>소개 및 내용</Typography>
                <Divider sx={{ mb: 2 }} />
                <div style={{ height: "300px", overflowY: "auto", whiteSpace: "pre-wrap", border: "soild" }}>
                    {post.content}
                </div>
            </Paper>
        
            {/* 댓글 */}
            
            <Comment url={`/recruitments/${recruitmentsId}`}/>
        </Container>
    );
};

export default DetailRecruitmentPost;

