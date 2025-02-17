import PropTypes from "prop-types";
import React, { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { CategoryLabel } from "../constants/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Stack,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Comment from "../../MainPage/components/comment/Comment";

const PostDetail = ({
  post = null,
  userInfo = null,
  onUpdatePost = () => {},
  onDeletePost = () => {},
}) => {
  const isAuthor = post?.userId === userInfo?.id;
  const { postId } = useParams();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 4 }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Stack spacing={3}>
          {/* 카테고리 */}
          <Typography variant="h6" className="post-category">
            {CategoryLabel[post?.category]}
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
              {post?.userNickname} | {post?.createdAt}
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

          <Comment url={`posts/${postId}`} />
        </Stack>
      </Box>
    </Box>
  );
};

PostDetail.propTypes = {
  post: PropTypes.object,
  onUpdatePost: PropTypes.func,
  onDeletePost: PropTypes.func,
  userInfo: PropTypes.object.isRequired,
};

export default PostDetail;
