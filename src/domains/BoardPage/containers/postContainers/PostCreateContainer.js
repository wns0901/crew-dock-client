import { useNavigate } from "react-router-dom";
import PostCreate from "../../components/postComponents/PostCreate";
import { useContext } from "react";
import { LoginContext } from "../../../../contexts/LoginContextProvider";

function PostCreateContainer() {
    const navigate = useNavigate();
    const {userInfo} = useContext(LoginContext);

    const onSubmit = async (postData) => { 
        
        const createPostData = {
            ...postData,
            userId: userInfo.id,
            createdAt: new Date().toISOString(),
        };

        const response = await fetch('/posts', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json',
                },
                body: JSON.stringify(createPostData)
            });
        const {id: postId} = await response.json();

    if (postData?.content?.includes('![')) {
        const imageUrls = extractImageUrls(postData.content);

        await Promise.all(imageUrls.map(url =>
            fetch(`/posts/${postId}/attachments`, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({url})
            })
        ));
    }

    navigate(`/posts/${postId}`);
};

    function extractImageUrls(markdownContent) {
        const urlRegex = /!\[.*?\]\((.*?)\)/g;
        const urls = [];
        let match;

        while((match = urlRegex.exec(markdownContent)) !== null) {
            urls.push(match[1]);
        }
        return urls;
    }

    const onImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/s3', {    // 임시 S3 이미지 업로드 URL
            method: 'POST',
            body: formData
        });

        const {fileURL} = await response.json();
        return fileURL;
    }

    const onCancel = () => {
        navigate(-1);
    };
    
    return <PostCreate onSubmit={onSubmit} onCancel={onCancel} onImageUpload={onImageUpload}/>
};