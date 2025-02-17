import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { DirectionLabel } from "../constants/Direction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Stack,
  Box,
  Button,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import Comment from "../../MainPage/components/comment/Comment";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const ProjectPostDetail = ({
  post = null,
  onUpdatePost = () => {},
  onDeletePost = () => {},
  onSubmitComment,
  userInfo = null,
  onDownloadAttachment = () => {},
}) => {
  const [comment, setComment] = useState({ content: "" });
  const isAuthor = post?.userId === userInfo?.id;
  const { postId, projectId } = useParams();
  const {projectRoles} = useContext(LoginContext);

  const isCaptain = projectRoles.some(role => role.role.isCaptain);

  if(!isCaptain) {
    return <Typography variant="body1">팀장만 작성할 수 있습니다.</Typography>;
  }


  const handleSubmitComment = () => {
    if (comment.content.trim()) {
      onSubmitComment(
        {
          content: comment.content,
          parentComment: null,
        },
        userInfo
      );
      setComment({ content: "" });
    }
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 4 }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Stack spacing={3}>
          {/* 카테고리 */}
          <Typography variant="h6" className="post-direction">
            {DirectionLabel[post?.direction]}
          </Typography>

          {/* 제목 */}
          <Typography variant="h4">{post?.title}</Typography>

          {/* 작성자 정보 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">
              <Link
                to={`/myPage/${post?.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post?.userNickname}
              </Link>
              {" | "}
              {post?.createdAt}
            </Typography>

            {isAuthor && (
              <Box>
                <Button
                  onClick={onUpdatePost}
                  startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                >
                  수정
                </Button>
                <Button
                  onClick={onDeletePost}
                  startIcon={<FontAwesomeIcon icon={faTrashCan} />}
                  color="error"
                >
                  삭제
                </Button>
              </Box>
            )}
          </Box>

          <Divider />

          {/* 본문 */}
          <Box>
            <MarkdownRenderer content={post?.content} />
          </Box>

          {/* 첨부파일 및 이미지 표시 */}
          {post?.attachments?.length > 0 && (
            <Box sx={{ position: "relative", overflow: "visible" }}>
              <Typography variant="h6">첨부 파일</Typography>
              <Stack spacing={1}>
                {post.attachments.map((attachment, index) => (
                  <Box key={index}>
                    <Button
                      onClick={() =>
                        onDownloadAttachment(attachment.id, attachment.fileName)
                      }
                    >
                      {attachment.fileName}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Divider />

          {/* 댓글 목록 */}
          <Comment url={`projects/${projectId}/posts/${postId}`} />
        </Stack>
      </Box>
    </Box>
  );
};

ProjectPostDetail.propTypes = {
  post: PropTypes.object,
  comments: PropTypes.array,
  onUpdatePost: PropTypes.func,
  onDeletePost: PropTypes.func,
  onSubmitComment: PropTypes.func.isRequired,
  onFixedComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  userInfo: PropTypes.object.isRequired,
  onDownloadAttachment: PropTypes.func,
  fixedComment: PropTypes.object,
  getTotalCommentsCount: PropTypes.func,
};

export default ProjectPostDetail;
