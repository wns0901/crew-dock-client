import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { useNavigate } from "react-router-dom";
import PostDetail from "../components/PostDetail";
import { useComments } from "../hooks/useComments";

const PostDetailContainer = ({postId}) => {
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
            const response = await fetch(`/posts/${postId}`);
            const data = await response.json();
            setPost(data);
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
                await fetch(`/posts/${postId}`, {
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

    return React.createElement(PostDetail, {
        post,
        comments,
        userInfo,
        onUpdatePost,
        onDeletePost,
        onSubmitComment,
        onFixedComment,
        onDeleteComment
    });
};

export default PostDetailContainer;