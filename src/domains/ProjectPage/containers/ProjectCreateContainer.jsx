import React, { useContext } from "react";
import api from "../../../apis/baseApi";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";
import { useParams } from "react-router-dom";

const PostCreateContainer = () => {
  const { projectId } = useParams(); 
  const {userInfo} = useContext(LoginContext);
  const {directionOptions, validatePost, navigate, onCancel} = useProjectPostForm();

  const onSubmit = async (postData) => {
  try {
      if (!validatePost(postData)) return;

      console.log('Content before sending:', postData.content);

      const createPostData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        category: 'NONE',
        direction: postData.direction,
        userNickname: userInfo.nickname,
        userId: userInfo.id,
        projectId: projectId
      };

      const response = await api.post(`/projects/${projectId}/posts`, createPostData);

      if (response.status === 500) {
        console.error('Server error details:', response.data);
        throw new Error(response.data.message || '서버 오류가 발생했습니다.');
      }

      const postId = response.data.id;

      navigate(`/projects/${projectId}/posts/${postId}`);
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
    initialData={{ category: 'NONE', title: '', content: '' , direction: ''}}
    isEdit={false}
    />
  );
};

  export default PostCreateContainer;