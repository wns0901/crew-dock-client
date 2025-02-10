import { useContext } from 'react';
import { LoginContext } from "../../../contexts/LoginContextProvider";
import PostForm from "../components/PostForm";
import { usePostForm } from '../hooks/usePostForm';

const PostCreateContainer = () => {
  const {userInfo} = useContext(LoginContext);
  const {categoryOptions, onImageUpload, handleAttachments, validatePost, navigate, onCancel} = usePostForm();

  const onSubmit = async (postData) => {
    try {
      if (!validatePost(postData)) return;

      const createPostData = {
        ...postData,
        userId: userInfo.userId,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/posts', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(createPostData)
      });

      if (!response.ok) {
        throw new Error('게시물 작성 중 오류가 발생했습니다.');
      }

      const {id: postId} = await response.json();
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
        initialData={{ category: '', title: '', content: '' }}
        isEdit={false}
    />
  );
};

export default PostCreateContainer;