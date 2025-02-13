import { useEffect, useState } from "react";
import api from "../../../apis/baseApi";

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [fixedComment, setFixedComment] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            const allComments = response.data.comments;
            
            const commentMap = new Map();
            allComments.forEach(comment => {
                comment.childComments = [];
                commentMap.set(comment.id, comment);
            });

            allComments.forEach(comment => {
                if (comment.parentsId) {
                    const parentComment = commentMap.get(comment.parentsId);
                    if (parentComment) {
                        parentComment.childComments.push(comment);
                    } else {
                        console.warn(`Parent comment with id ${comment.parentsId} not found for comment ${comment.id}`);
                        comment.parentsId = null; 
                    }    
                }
            });

            const baseTopLevelComments = allComments.filter(comment => !comment.parentsId);
            const fixed = baseTopLevelComments.find(comment => comment.fixed);

            setFixedComment(fixed || null);
            setComments(baseTopLevelComments.filter(comment => !comment.fixed));
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            setComments([]);
            setFixedComment(null);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const onSubmitComment = async (commentData, userInfo) => {
        if (!userInfo || !userInfo.id) {
            console.error('사용자 정보가 없습니다.');
            return;
        }
        
        const payload = {
            postId: postId,
            content: commentData.content,
            fixed: false,
            parentComment:  commentData?.parentComment ? { id: commentData.parentComment.id } : null,
            user: { id: userInfo.id }
        };

        try {
            const response = await api.post(`/posts/${postId}/comments`, payload);
            
            if (response.status === 200 || response.status === 201) {
                await fetchComments();
            }
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            console.log('에러 응답:', error.response?.data);
        }
    };
    
    const onFixedComment = async (commentId) => {
        try {
            if (fixedComment) {
                await api.patch(`/posts/${postId}/comments`, { 
                    id: fixedComment.id,
                    fixed: false 
                });
            }
    
            const response = await api.patch(`/posts/${postId}/comments`, { 
                id: commentId,
                fixed: true 
            });
            
            if (response.status === 200) {
                setFixedComment(comments.find(comment => comment.id === commentId) || null);
                setComments(prev => prev.map(c => ({ ...c, fixed: c.id === commentId })));
            }
        } catch (error) {
            console.error('댓글 고정 실패:', error);
        }
    };
    
    const onDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
            
            if (response.status === 200) {
                setComments(comments.map(comment => {
                        console.log(1);
                        
                        if (comment.id === commentId) {
                            return { ...comment, deleted: true, content: "삭제된 댓글입니다." };
                        }
                        if (comment.childComments) {
                            return {
                                ...comment,
                                childComments: comment.childComments.filter(childComment => childComment.id !== commentId)
                            };
                        }
                        return comment;
                    }).filter(comment => !comment.deleted || (comment.childComments && comment.childComments.length > 0))
                );
    
                if (fixedComment?.id === commentId) {
                    setFixedComment(null);
                }
            }
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };

    return {
        comments,
        fixedComment,
        onSubmitComment,
        onFixedComment,
        onDeleteComment
    };
};