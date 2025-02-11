import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { usePostForm } from "../hooks/usePostForm";
import api from "../../../apis/baseApi";

const PostEditContainer = () => {
    const {postId} = useParams();
    const { categoryOptions, onImageUpload, handleAttachments, validatePost, navigate, onCancel } = usePostForm();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchPost = async (postId) => {
            try {
                const response = await api.get(`/posts/${postId}`);
                setInitialData({
                    id: response.data.id,
                    createdAt: response.data.createdAt,
                    title: response.data.title,
                    content: response.data.content,
                    category: response.data.category,
                    direction: response.data.direction,
                    userId: response.data.userId,
                    userNickname: response.data.userNickname || null,
                    attachments: response.data.attachments || [],
                });
                console.log(response.data.userNickname);
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
                alert(error.message);
                navigate(-1);
            }
        };
        fetchPost();
    }, [postId, navigate]);

    const onSubmit = async (postData) => {
        try {
            if(!validatePost(postData)) return;

            const response = await api.patch(`/posts`, {id: postId,...postData});

            if (!response.ok) throw new Error('게시물 수정 중 오류가 발생했습니다.');

            await handleAttachments(postId, postData.content);
            navigate(`/posts/${postId}`);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (!initialData) return <div>Loading...</div>;

    return (
        <PostForm
            initialData={initialData}
            isEdit={true}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onImageUpload={onImageUpload}
            categoryOptions={categoryOptions}
        />
    );
};

export default PostEditContainer;