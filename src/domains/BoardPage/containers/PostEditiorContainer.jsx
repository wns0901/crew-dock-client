import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { usePostForm } from "../hooks/usePostForm";

const PostEditContainer = () => {
    const {postId} = useParams();
    const { categoryOptions, onImageUpload, handleAttachments, validatePost, navigate, onCancel } = usePostForm();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/posts/${postId}`);
                if (!response.ok) throw new Error ('게시글을 불러올 수 없습니다.');
                const data = await response.json();
                setInitialData(data);
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
                navigate(-1);
            }
        };
        fetchPost();
    }, [postId]);

    const onSubmit = async (postData) => {
        try {
            if(!validatePost(postData)) return;

            const response = await fetch(`/posts`, {
                method: 'PATCH',
                headers: {'Content-type': 'application/json',},
                body: JSON.stringify({
                    id: postId,
                    ...postData
                })
            });

            if (!response.ok) throw new Error('게시물 수정 중 오류가 발생했습니다.');

            await handleAttachments(postId, postData.content);
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
            onImageUpload={onImageUpload}
            categoryOptions={categoryOptions}
        />
    );
};

export default PostEditContainer;