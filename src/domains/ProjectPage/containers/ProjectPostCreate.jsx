import React, { useContext } from "react";
import api from "../../../apis/baseApi";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";

const PostCreateContainer = () => {
  const {userInfo} = useContext(LoginContext);
  const {directionOptions, validatePost, navigate, onCancel} = useProjectPostForm();

  const onSubmit = async (postData) => {
  try {
      if (!validatePost(postData)) return;

      console.log('Content before sending:', postData.content);

      const createPostData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        category: postData.category,
        direction: 'NONE',
        userNickname: userInfo.nickname,
        userId: userInfo.id,
        projectId: null
      };

      const response = await api.post('/posts', createPostData);

      if (response.status === 500) {
        console.error('Server error details:', response.data);
        throw new Error(response.data.message || '서버 오류가 발생했습니다.');
      }

      const postId = response.data.id;

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
    initialData={{ category: '', title: '', content: '' , direction: 'NONE'}}
    isEdit={false}
    />
  );
};

  export default PostCreateContainer;