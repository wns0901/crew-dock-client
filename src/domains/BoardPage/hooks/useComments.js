import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const fetchComments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`댓글 로딩 실패: ${errorText}`);
            }
            const data = await response.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            setComments([]);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const onSubmitComment = async (comment, userInfo) => {
        const createCommentData = {
            ...comment,
            userId: userInfo.id,
        }

        try {
            await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({createCommentData})
            });
            fetchComments();
        } catch(error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    const onFixedComment = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({fixed: true})
            });
            fetchComments();
        } catch(error) {
            console.error('댓글 고정 실패:', error);
        }
    };

    const onDeleteComment = async (commentId) => {
        try {
            await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE'
            });
            fetchComments();
            navigate(`/posts/${postId}`)
        } catch (error) {
            console.error('댓글 삭제에 실패:', error);
        }
    };

    return {
        comments,
        onSubmitComment,
        onFixedComment,
        onDeleteComment
    };
}