import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import PostDetail from "../components/PostDetail";
import { useComments } from "../hooks/useComments";

const PostDetailContainer = () => {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const {userInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const { 
        comments, 
        onSubmitComment, 
        onFixedComment, 
        onDeleteComment 
    } = useComments(postId);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`게시글 로딩 실패: ${errorText}`);
            }
        
            const originalData = await response.json();
        
            const processedData = {
                id: originalData.id,
                createdAt: originalData.createdAt,
                title: originalData.title,
                content: originalData.content,
                category: originalData.category,
                direction: originalData.direction,
                userId: originalData.userId,
                nickname: originalData.user?.nickname || null,
                attachments: originalData.attachments || []
            };
          
            setPost(processedData);
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    };

    const onUpdatePost = async () => {
        if(window.confirm('게시글을 수정하시겠습니까?')) {
            navigate(`/posts/${postId}`)
        }
    };

    const onDeletePost = async () => {
        if(window.confirm('게시글을 삭제하시겠습니까?')) {
            try {
                await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
                    method: 'DELETE'
                });
                navigate('/posts', {
                    search: `?page=1&category=${post.category}`
                });
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
            }
        }
    };

    const handleSubmitComment = (comment) => {
        onSubmitComment(comment, userInfo);
    };
    

    return (
        <PostDetail
            post={post}
            comments={comments}
            userInfo={userInfo}
            onUpdatePost={onUpdatePost}
            onDeletePost={onDeletePost}
            onSubmitComment={handleSubmitComment}
            onFixedComment={onFixedComment}
            onDeleteComment={onDeleteComment}
        />
    );
};

export default PostDetailContainer;