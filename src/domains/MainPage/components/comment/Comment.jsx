import { useContext, useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import api from "../../../../apis/baseApi";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { LoginContext } from "../../../../contexts/LoginContextProvider.jsx";

const Comment = ({ url }) => {
  const { userInfo, isLogin } = useContext(LoginContext);
  const [comments, setComments] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [commentCnt, setCommentCnt] = useState(0);

  useEffect(() => {
    api.get(`${url}/comments`).then((response) => {
      const parentComments = [];
      const { comments } = response.data;

      setCommentCnt(response.data.count);

      comments.forEach((comment) => {
        if (comment.parentCommentId) {
          const parentComment = parentComments.find(
            (parentComment) => parentComment.id === comment.parentCommentId
          );
          parentComment.childs.push(comment);
        } else {
          comment.childs = [];
          parentComments.push(comment);
        }
      });
      setComments(parentComments);
    });
  }, []);

  const handleAddComment = async (content, parentCommentId) => {
    const postData = {
      userId: userInfo?.id,
      content,
      parentCommentId,
    };


    api.post(`${url}/comments`, postData).then((response) => {
      response.data.userName = userInfo?.nickname;
      if (parentCommentId) {
        const parentComment = comments.find(
          (comment) => comment.id === parentCommentId
        );
        parentComment.childs.push(response.data);
        setComments([...comments]);
        setCommentCnt(commentCnt + 1);
        setReplyToId(null);
      } else {
        response.data.childs = [];
        setComments([...comments, response.data]);
        setCommentCnt(commentCnt + 1);
      }
    });
  };

  const handleDeleteComment = async (commentId) => {
    const {data} = await api.delete(`${url}/comments/${commentId}`);

    console.log(data);  

    if(data === 'parent') {
      setCommentCnt(commentCnt - 1);
      setComments(comments.map((comment) => {
        if(comment.id === commentId) {
          comment.isDeleted = true;
        }
        return comment;
      }));
    } else if(data === 'deleted') {
      setCommentCnt(commentCnt - 1);
      setComments(
        comments.filter((comment) => {
          if (comment.childs.length > 0) {
            comment.childs = comment.childs.filter(
              (child) => child.id !== commentId
            );
          }
          return comment.id !== commentId;
        })
      );
    }

  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ textAlign: "left", float: "left" }}>
        댓글
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "right", float: "right" }}>
        댓글 수: {commentCnt}
      </Typography>  
      </Box>
      <Divider sx={{ mb: 2, clear: "both" }} />
      {isLogin && <CommentForm onSubmit={handleAddComment} />}
      <Box sx={{ mt: 2 }}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userInfo={userInfo}
            onReply={(commentId) => setReplyToId(commentId)}
            onDelete={handleDeleteComment}
            replyToId={replyToId}
            handleAddComment={handleAddComment}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Comment;
