import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";
import api from "../../../apis/baseApi";

const ProjectPostCreate = () => {
  const { projectId } = useParams();
  const { userInfo } = useContext(LoginContext);
  const { directionOptions, validatePost, navigate, onCancel } = useProjectPostForm();

  const onSubmit = async (postData) => {
    try {
      if (!validatePost(postData)) return;

      const createPostData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        category: postData.category,
        direction: 'NONE',
        userNickname: userInfo.nickname,
        userId: userInfo.id,
        projectId: postData.projectId
      };

      const response = await api.post(`/projects/${projectId}/posts`, createPostData);

      if (response.status === 500) {
        console.error('Server error details:', response.data);
        throw new Error(response.data.message || '서버 오류가 발생했습니다.');
      }

      const postId = response.data.id;


      // const imageUrls = extractImageUrls(postData.content);

      // for (const url of imageUrls) {
      //   if(url.startsWith('data:image')) {
      //     const file = base64ToFile(url);
      //     await createImgUrl(file);
      //   } else {
      //     await saveExternalImageUrl(postId, url);
      //   }
      // }
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <ProjectPostForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      directionOptions={directionOptions}
      initialData={{ category: 'NONE', title: '', content: '', direction: '' }}
      isEdit={false}
    />
  );
};

export default ProjectPostCreate;