import { useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";
import api from "../../../../apis/baseApi";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { LoginContext } from "../../../../contexts/LoginContextProvider.jsx";

const Comment = ({url}) => {
  const { userInfo, isLogin } = useContext(LoginContext);
  const [comments, setComments] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  
  useEffect(() => {
    api.get(`${url}/comments`).then((response) => {
      const parentComments = [];
      response.data.forEach((comment) => {
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
      console.log("🟢 [DEBUG] 불러온 댓글 목록:", parentComments);
      
    });
  }, [recruitmentsId]);

  const handleAddComment = async (content, parentCommentId) => {
    
    const postData = {
      userId: userInfo?.id,
      content,
      parentCommentId,
    };

    console.log("🟢 [DEBUG] 작성할 댓글 데이터:", postData);
    
    api.post(`${url}/comments`,postData)
      .then((response) => {
        if (parentCommentId) {
          const parentComment = comments.find(
            (comment) => comment.id === parentCommentId
          );
          parentComment.childs.push(response.data);
          setComments([...comments]);
          setReplyToId(null);
        } else {
          setComments([...comments, response.data]);
        }

      });

  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`${url}/comments/${commentId}`);

    setComments(comments.filter((comment) => {
      if (comment.childs.length > 0) {
        comment.childs = comment.childs.filter((child) => child.id !== commentId);
      }
      return comment.id !== commentId;
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      {isLogin && (<CommentForm onSubmit={handleAddComment} />)}
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
