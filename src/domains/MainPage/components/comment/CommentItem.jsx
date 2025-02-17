import { Box, Typography, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentForm from "./CommentForm";
import { useContext } from "react";
import { LoginContext } from "../../../../contexts/LoginContextProvider";

const CommentItem = ({
  comment,
  userInfo,
  onReply,
  onDelete,
  replyToId,
  handleAddComment,
}) => {
  if (!comment) return null; // comment가 없을 경우 처리
  const {isLogin} = useContext(LoginContext);
  const CommentContent = () => {
    if (comment.isDeleted) {
      return comment.childs?.length > 0 ? (
        <Typography variant="body1">삭제된 댓글입니다.</Typography>
      ) : null;
    }

    return (
      <>
        <Box sx={{ mb: 1, overflow: "hidden" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              float: "left",
            }}
          >
            {comment.userName}
          </Typography>
          <Box sx={{ float: "right" }}>
            {comment.userId === userInfo?.id && (
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={(e) => onDelete(comment.id)}
              >
                삭제
              </Button>
            )}
            {!comment.parentCommentId && isLogin && (
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => onReply(comment.id)}
              >
                답글
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 1, clear: "both" }}>
          <Typography variant="body1">{comment.content}</Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            {comment.createdAt}
          </Typography>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <CommentContent />
      </Box>

      {/* 답글 입력 폼 */}
      {replyToId === comment.id && (
        <Box sx={{ mt: 1, ml: 4 }}>
          <CommentForm
            onSubmit={handleAddComment}
            parentCommentId={replyToId}
          />
        </Box>
      )}

      {/* 자식 댓글 */}
      {comment.childs?.map((childComment) => (
        <Box key={childComment.id} sx={{ ml: 7, mt: 1 }}>
          <CommentItem
            comment={childComment}
            userInfo={userInfo}
            onReply={onReply}
            onDelete={onDelete}
            replyToId={replyToId}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CommentItem;
