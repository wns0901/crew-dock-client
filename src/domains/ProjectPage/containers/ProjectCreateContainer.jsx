import React, { useContext, useEffect, useState } from "react";
import api from "../../../apis/baseApi";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";
import { useParams } from "react-router-dom";

const PostCreateContainer = () => {
  const { projectId } = useParams();
  const { userInfo } = useContext(LoginContext);
  const { directionOptions, validatePost, navigate, onCancel } = useProjectPostForm();

  const onSubmit = async (postData) => {
    try {
      if (!validatePost(postData)) return;
  
      const createPostData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        category: 'NONE',
        direction: postData.direction,
        userNickname: userInfo.nickname,
        userId: userInfo.id,
        projectId: projectId,
      };
  
      const response = await api.post(`/projects/${projectId}/posts`, createPostData);
  
      if (response.status !== 200) {
        throw new Error(response.data.message || '게시글 생성 중 오류 발생');
      }
  
      const newPostId = response.data.id;
  
      if (postData.attachments && postData.attachments.length > 0) {
        const formData = new FormData();
        
        postData.attachments.forEach((attachment, index) => {
          console.log(`Appending file ${index + 1}:`, attachment.file);
          formData.append('file', attachment.file);
        }
      );
  
        console.log("formData:", formData);
        
        const fileResponse = await api.post(
          `/projects/${projectId}/posts/${newPostId}/attachments`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log('fileAPI응답:', fileResponse.data);
  
        if (fileResponse.status !== 200) {
          console.error('파일 업로드 실패:', fileResponse.data);
          alert('파일 업로드 중 오류가 발생했습니다.');
        }
      }
  
      if (newPostId) {
        try {
          navigate(`/projects/${projectId}/posts/${newPostId}`);
        } catch (navError) {
          console.error('Navigation error:', navError);
          window.location.href = `/projects/${projectId}/posts/${newPostId}`;
        }
      }
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`게시글 생성 오류: ${error.message}`);
    }
  };

  return (
    <ProjectPostForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      directionOptions={directionOptions}
      initialData={{ category: 'NONE', title: '', content: '', direction: '' }}
      isEdit={false}
      projectId={projectId}
    />
  );
};

export default PostCreateContainer;