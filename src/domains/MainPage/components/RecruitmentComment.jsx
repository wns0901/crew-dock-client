import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../../apis/baseApi";
import { 
  Box, Button, Divider, List, ListItem, TextField, Typography, IconButton
} from "@mui/material";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply"; // 대댓글 아이콘

const RecruitmentComment = () => {
    const { recruitmentsId } = useParams();
    const { userInfo } = useContext(LoginContext);
    
    const [comments, setComments] = useState([]); // 댓글 목록
    const [newComment, setNewComment] = useState(""); // 입력 중인 댓글
    const [replyTo, setReplyTo] = useState(null); // 대댓글 대상 댓글 ID

    // ✅ 댓글 목록 불러오기
    useEffect(() => {
        fetchComments();
    }, [recruitmentsId]);

    const fetchComments = () => {
        api.get(`/recruitments/${recruitmentsId}/comments`)
            .then((response) => {
                console.log("🟢 [DEBUG] 불러온 댓글 목록:", response.data);
                setComments(structureComments(response.data)); // ✅ 계층 구조로 변환 후 저장
            })
            .catch((error) => console.error("❌ 댓글 불러오기 실패:", error));
    };

    // ✅ 댓글을 계층 구조로 변환
    const structureComments = (commentList) => {
        let commentMap = {}; // 댓글 ID로 매핑
        let rootComments = []; // 최상위 댓글

        commentList.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] }; // 기본 댓글 객체
        });

        commentList.forEach(comment => {
            if (comment.parentCommentId) {
                // 부모 댓글에 대댓글 추가
                commentMap[comment.parentCommentId]?.replies.push(commentMap[comment.id]);
            } else {
                rootComments.push(commentMap[comment.id]);
            }
        });

        console.log("🟢 [DEBUG] 변환된 계층 구조:", rootComments);
        return rootComments;
    };

    // ✅ 댓글 작성
    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const postData = {
            userId: userInfo?.id,
            userName: userInfo?.nickname, 
            content: newComment,
            parentCommentId: replyTo,  // ✅ 대댓글이면 부모 댓글 ID 설정
        };

        console.log("🟢 [DEBUG] 전송할 댓글 데이터:", postData);

        api.post(`/recruitments/${recruitmentsId}/comments`, postData)
            .then(() => {
                console.log("✅ 댓글 작성 성공");
                setNewComment("");
                setReplyTo(null);  // ✅ 대댓글 작성 후 초기화
                fetchComments();
            })
            .catch((error) => {
                console.error("❌ 댓글 작성 실패:", error);
                console.error("❌ 백엔드 응답:", error.response?.data);
            });
    };

    // ✅ 댓글 삭제
    const handleDeleteComment = (commentId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        console.log(`🟠 [DEBUG] 삭제 요청: 댓글 ID ${commentId}`);

        api.delete(`/recruitments/${recruitmentsId}/comments/${commentId}`)
            .then(() => {
                alert("댓글이 삭제되었습니다!");
                fetchComments();
            })
            .catch(error => {
                console.error("❌ 댓글 삭제 실패:", error);
                alert("댓글 삭제 중 오류가 발생했습니다.");
            });
    };

    // ✅ 댓글을 계층 구조로 렌더링 (대댓글 들여쓰기 적용)
    const renderComments = (commentList, level = 0) => {
        return commentList.map(comment => (
            <Box 
                key={comment.id} 
                sx={{ 
                    paddingLeft: `${level * 20}px`, // ✅ 대댓글 들여쓰기 적용
                    borderLeft: level > 0 ? "2px solid #ddd" : "none", // ✅ 대댓글 구분선 추가
                    marginBottom: 1
                }}
            >
                <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {comment.userName}
                        </Typography>
                        <Typography variant="body2">
                            {comment.content || "삭제된 댓글입니다."}
                        </Typography>
                    </Box>
                    <Box>
                        {/* ✅ 대댓글 버튼 (대댓글에는 대댓글 X) */}
                        {level === 0 && (
                            <IconButton onClick={() => {
                                console.log(`🔵 [DEBUG] 대댓글 대상: 댓글 ID ${comment.id}`);
                                setReplyTo(comment.id);
                            }}>
                                <ReplyIcon />
                            </IconButton>
                        )}

                        {/* ✅ 삭제 버튼 (작성자만 가능) */}
                        {userInfo?.id === comment.userId && (
                            <IconButton onClick={() => handleDeleteComment(comment.id)}>
                                <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                        )}
                    </Box>
                </ListItem>

                {/* ✅ 대댓글 입력창 (선택된 댓글 아래 표시) */}
                {replyTo === comment.id && (
                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 1, paddingLeft: "20px" }}>
                        <TextField 
                            fullWidth 
                            label="대댓글을 입력하세요" 
                            variant="outlined"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddComment}>
                            작성
                        </Button>
                    </Box>
                )}

                {/* ✅ 대댓글 렌더링 (최대 1단계) */}
                {comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
            </Box>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">댓글 ({comments.length})</Typography>
            <Divider sx={{ mb: 2 }} />

            {/* 🔹 댓글 입력창 */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                <TextField 
                    fullWidth 
                    label="댓글을 입력하세요" 
                    variant="outlined"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment}>
                    작성
                </Button>
            </Box>

            {/* 🔹 댓글 목록 */}
            <List>{renderComments(comments)}</List>
        </Box>
    );
};

export default RecruitmentComment;
