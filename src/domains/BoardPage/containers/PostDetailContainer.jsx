import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import PostDetail from "../components/PostDetail";
import { useComments } from "../hooks/useComments";
import api from "../../../apis/baseApi";

const PostDetailContainer = () => {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const {userInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const { 
        comments,
        fixedComment, 
        onSubmitComment, 
        onFixedComment, 
        onDeleteComment 
    } = useComments(postId);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${postId}`);
            setPost({
                id: response.data.id,
                createdAt: response.data.createdAt,
                title: response.data.title,
                content: response.data.content,
                category: response.data.category,
                direction: response.data.direction,
                userId: response.data.user?.id || response.data.userId,
                userNickname: response.data.userNickname || null,
                attachments: response.data.attachments || [],
            });


        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    };

    const onUpdatePost = async () => {
        if(window.confirm('게시글을 수정하시겠습니까?')) {
            navigate(`/posts/${postId}/edit`)
        }
    };

    const onDeletePost = async () => {
        if(window.confirm('게시글을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/posts/${postId}`);
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
            fixedComment={fixedComment}
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