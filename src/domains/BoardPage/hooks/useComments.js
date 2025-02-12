import { useEffect, useState } from "react";
import api from "../../../apis/baseApi";

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [fixedComment, setFixedComment] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            const allComments = response.data.comments.comment;
            const fixed = allComments.find(comment => comment.fixed);
            setFixedComment(fixed || null);
            setComments(allComments.filter(comment => !comment.fixed));
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            setComments([]);
            setFixedComment(null);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const onSubmitComment = async (comment, userInfo) => {
        const createCommentData = {
            content: comment.content,
            parentComment: comment.parentsId 
            ? { id: comment.parentsId } 
            : null,
            user: { id: userInfo.id },
            postId: postId
        }

        try {
            const response = await api.post(`/posts/${postId}/comments`, createCommentData);
            if (response.status === 200 || response.status === 201) {
                const commentsResponse = await api.get(`/posts/${postId}/comments`);
                const allComments = commentsResponse.data.comments.comment;
                const fixed = allComments.find(comment => comment.fixed);

                setFixedComment(fixed || null);
                setComments(allComments.filter(comment => !comment.fixed));
            }
        } catch(error) {
            console.error('댓글 작성 실패:', error);
            console.log('에러 응답:', error.response?.data);
        }
    };

    const onFixedComment = async (commentId) => {
        try {
            if (fixedComment) {
                await api.patch(`/posts/${postId}/comments`, { id: fixedComment.id, fixed: false });
            }
            const response = await api.patch(`/posts/${postId}/comments`, { id: commentId, fixed: true });
            if(response.status === 200) {
                fetchComments();
            }
        } catch(error) {
            console.error('댓글 고정 실패:', error);
            console.log('Error details:', error.response);
        }
    };

    const onDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
            if(response.status === 200) {
                const deletedComment = comments.find(comment => comment.id === commentId);
                setComments(prevComments => {
                    if (!deletedComment.parentComment) {
                        const hasChildComments = prevComments.some(
                            comment => comment.parentComment && comment.parentComment.id === commentId
                        );
    
                        return hasChildComments
                            ? prevComments.map(comment => 
                                comment.id === commentId 
                                    ? { ...comment, deleted: true, content: '삭제된 댓글입니다' } 
                                    : comment
                              )
                            : prevComments.filter(comment => comment.id !== commentId);
                    }
                    return prevComments.filter(comment => comment.id !== commentId);
                });

                if (fixedComment && fixedComment.id === commentId) {
                    setFixedComment(null);
                }
                fetchComments();
            }
        } catch (error) {
            console.error('댓글 삭제에 실패:', error);
        }
    };

    return {
        comments,
        fixedComment,
        onSubmitComment,
        onFixedComment,
        onDeleteComment
    };
}