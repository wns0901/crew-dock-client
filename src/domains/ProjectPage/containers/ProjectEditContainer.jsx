import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";
import api from "../../../apis/baseApi";

const ProjectEditContainer = () => {
    const {postId, projectId} = useParams();
    const { directionOptions, validatePost, navigate, onCancel } = useProjectPostForm();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchPost = async (postId) => {
            try {
                const response = await api.get(`/projects/${projectId}/posts/${postId}`);
                const attachmentsResponse = await api.get(`/projects/${projectId}/posts/${postId}/attachments`);
                setInitialData({
                    id: response.data.id,
                    createdAt: response.data.createdAt,
                    title: response.data.title,
                    content: response.data.content,
                    category: response.data.category,
                    direction: response.data.direction,
                    userId: response.data.userId,
                    userNickname: response.data.userNickname || null,
                    attachments: Array.isArray(attachmentsResponse.data) ? attachmentsResponse.data.map(attachment => ({
                        id: attachment.postId,
                        type: 'file',
                        name: attachment.fileName,
                        url: attachment.url
                    })) : []
                });
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
                alert(error.message);
                navigate(-1);
            }
        };
        fetchPost(postId);
    }, []);

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

            if (postData.attachments && postData.attachments.length > 0) {
                const formData = new FormData();
                
                const newFiles = postData.attachments.filter(attachment => attachment.file);
                newFiles.forEach((attachment, index) => {
                    console.log(`Appending file ${index + 1}:`, attachment.file);
                    formData.append('file', attachment.file);
                });

                if (formData.has('file')) {
                    const fileResponse = await api.post(
                        `/projects/${projectId}/posts/${postId}/attachments`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    if (fileResponse.status !== 200) {
                        throw new Error('파일 업로드 중 오류가 발생했습니다.');
                    }
                }
            }

            const removedAttachments = initialData.attachments.filter(
                oldAttachment => !postData.attachments.some(
                    newAttachment => newAttachment.id === oldAttachment.id
                )
            );

            for (const attachment of removedAttachments) {
                await api.delete(`/projects/${projectId}/posts/${postId}/attachments/${attachment.id}`);
            }
            
            navigate(`/projects/${projectId}/posts/${postId}`);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };
    console.log("현재 initialData:", initialData);
    if (!initialData) return <div>Loading...</div>;

    return (
        <ProjectPostForm
            initialData={initialData}
            isEdit={true}
            onSubmit={onSubmit}
            onCancel={onCancel}
            directionOptions={directionOptions}
        />
    );
};

export default ProjectEditContainer;
