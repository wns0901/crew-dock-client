import React, { useState } from "react";
import { Box, Button, ListItem, TextField, Typography } from "@mui/material";
import api from "../../../apis/baseApi";

const CommentItem = ({ comment, onUpdate }) => {
    const [reply, setReply] = useState(""); // 대댓글 입력창
    const [showReplyBox, setShowReplyBox] = useState(false);

    // 댓글 삭제 요청
    const handleDelete = () => {
        api.delete(`/recruitments/${comment.recruitmentId}/comments/${comment.id}`)
            .then(() => onUpdate())
            .catch((error) => console.error("❌ 댓글 삭제 실패:", error));
    };

    // 대댓글 작성 요청
    const handleReply = () => {
        if (!reply.trim()) return;

        const postData = {
            content: reply,
            parentCommentId: comment.id,
        };

        api.post(`/recruitments/${comment.recruitmentId}/comments`, postData)
            .then(() => {
                setReply("");
                setShowReplyBox(false);
                onUpdate();
            })
            .catch((error) => console.error("❌ 대댓글 작성 실패:", error));
    };

    return (
        <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ width: "100%" }}>
                <Typography variant="body1">
                    <strong>{comment.userName}</strong>: {comment.content}
                </Typography>
            </Box>

            {/* 댓글 버튼 */}
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Button size="small" onClick={() => setShowReplyBox(!showReplyBox)}>
                    대댓글
                </Button>
                <Button size="small" color="error" onClick={handleDelete}>
                    삭제
                </Button>
            </Box>

            {/* 대댓글 입력창 */}
            {showReplyBox && (
                <Box sx={{ mt: 1, width: "100%" }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        label="대댓글 작성" 
                        value={reply} 
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={handleReply}>
                        작성
                    </Button>
                </Box>
            )}
        </ListItem>
    );
};

export default CommentItem;
