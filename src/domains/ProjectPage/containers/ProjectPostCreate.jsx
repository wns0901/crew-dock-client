import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import ProjectPostForm from "../components/ProjectPostForm";
import { useProjectPostForm } from "../hooks/useProjectPostForm";

const ProjectPostCreate = () => {
  const {projectId} = useParams();
  const {userInfo} = useContext(LoginContext);
  const {directionOptions, onImageUpload, handleAttachments, validatePost, navigate, onCancel} = useProjectPostForm();

  const onSubmit = async (postData) => {
  try {
    if (!validatePost(postData)) return;

    const createPostData = {
      ...postData,
      category: 'NONE',
      userId: userInfo.id
    };

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/projects/${projectId}/posts`, {
      method: 'POST',
      headers: {'Content-type': 'application/json',},
      body: JSON.stringify(createPostData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('게시물 작성 중 오류가 발생했습니다.', errorText);
    }

    const responseText = await response.text();
    let postId;

    try {
      const idMatch = responseText.match(/"id":(\d+)/);
      postId = idMatch ? parseInt(idMatch[1]) : null;
    } catch (parseError) {
      console.error('ID 추출 오류:', parseError);
      throw new Error('게시물 ID를 찾을 수 없습니다.');
    }
      await handleAttachments(postId, postData.content);
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
        onImageUpload={onImageUpload}
        directionOptions={directionOptions}
        initialData={{ category: 'NONE', title: '', content: '' , direction: ''}}
        isEdit={false}
    />
  );
};

  export default ProjectPostCreate;