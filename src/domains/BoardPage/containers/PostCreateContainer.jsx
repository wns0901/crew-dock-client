import React, { useContext } from "react";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import PostForm from "../components/PostForm";
import { usePostForm } from "../hooks/usePostForm";
import api from "../../../apis/baseApi";

const PostCreateContainer = () => {
  const {userInfo} = useContext(LoginContext);
  const {categoryOptions, onImageUpload, handleAttachments, validatePost, navigate, onCancel} = usePostForm();

  const onSubmit = async (postData) => {
  try {
    if (!validatePost(postData)) return;

    const createPostData = {
      ...postData,
      direction: 'NONE',
      userId: userInfo.id
    };

    const response = api.post('/posts', createPostData);

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
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
  }
};

return (
    <PostForm
    onSubmit={onSubmit}
    onCancel={onCancel}
    onImageUpload={onImageUpload}
    categoryOptions={categoryOptions}
    initialData={{ category: '', title: '', content: '' , direction: 'NONE'}}
    isEdit={false}
    />
  );
};

  export default PostCreateContainer;