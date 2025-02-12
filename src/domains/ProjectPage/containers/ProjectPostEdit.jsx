import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";
import api from "../../../apis/baseApi";

const ProjectPostEdit = () => {
    const {postId, projectId} = useParams();
    const { categoryOptions, validatePost, navigate, onCancel } = useProjectPostForm();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchPost = async (postId) => {
            try {
                const response = await api.get(`/projects/${projectId}/posts/${postId}`);
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
    }, [postId, navigate, projectId]);

    const onSubmit = async (postData) => {
        try {
            if(!validatePost(postData)) return;

            const updateData = {
                id: initialData.id,
                title: postData.title.trim(),
                content: postData.content.trim(),
                category: 'NONE',
                direction: postData.direction,
                userId: initialData.userId,
                userNickname: initialData.userNickname,
                projectId: projectId
            };

            const response = await api.patch(`/projects/${projectId}/posts`, updateData);
        
            if (response.status === 500) {
                console.error('Server error details:', response.data);
                throw new Error(response.data.message || '서버 오류가 발생했습니다.');
            }
            
            navigate(`/projects/${projectId}/posts/${postId}`);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (!initialData) return <div>Loading...</div>;

    return (
        <ProjectPostForm
            initialData={initialData}
            isEdit={true}
            onSubmit={onSubmit}
            onCancel={onCancel}
            categoryOptions={categoryOptions}
        />
    );
};

export default ProjectPostEdit;