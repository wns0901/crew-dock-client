import { Box, Typography, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentForm from "./CommentForm";

const CommentItem = ({
  comment,
  userInfo,
  onReply,
  onDelete,
  replyToId,
  handleAddComment,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      {!comment.isDeleted ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)", // 그림자 효과 추가
          }}
        >
          {/* 첫 번째 줄: 닉네임과 버튼들 */}
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
              {comment.parentCommentId !== null || (
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

          {/* 두 번째 줄: 내용 */}
          <Box sx={{ mb: 1, clear: "both" }}>
            <Typography variant="body1">{comment.content}</Typography>
          </Box>

          {/* 세 번째 줄: 작성일 */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary">
              {comment.createdAt}
            </Typography>
          </Box>
        </Box>
      ) : 
      comment.childs.length === 0 ||
      (<Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)", // 삭제된 댓글에도 동일한 그림자 적용
          }}
        >
          <Typography variant="body1">삭제된 댓글입니다.</Typography>
        </Box>)
      }

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
