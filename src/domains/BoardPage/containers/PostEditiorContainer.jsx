import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { usePostForm } from "../hooks/usePostForm";
import api from "../../../apis/baseApi";

const PostEditContainer = () => {
    const {postId} = useParams();
    const { categoryOptions, validatePost, navigate, onCancel } = usePostForm();
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
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
                alert(error.message);
                navigate(-1);
            }
        };
        fetchPost(postId);
    }, [postId, navigate]);

    const onSubmit = async (postData) => {
        try {
            if(!validatePost(postData)) return;

            const updateData = {
                id: initialData.id,
                title: postData.title.trim(),
                content: postData.content.trim(),
                category: postData.category,
                direction: 'NONE',
                userId: initialData.userId,
                userNickname: initialData.userNickname,
                projectId: null
            };

            const response = await api.patch('/posts', updateData);
        
            if (response.status === 500) {
                console.error('Server error details:', response.data);
                throw new Error(response.data.message || '서버 오류가 발생했습니다.');
            }
            
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
            categoryOptions={categoryOptions}
        />
    );
};

export default PostEditContainer;