import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Category } from "../\bconstants/\bCategory";
import api from "../../../apis/baseApi";

export const usePostForm = () => {
    const navigate = useNavigate();
    const {roles} = useContext(LoginContext);

    const categoryOptions = Object.values(Category).filter(category => {
        const isAdmin = roles?.isAdmin ?? false;
        if (isAdmin) {
          return true;
        }
        return category === Category.NONE || category === Category.FORUM;
    });

    // const extractImageUrls = (markdownContent) => {
    //     const urlRegex =  /!\[.*?\]\((.*?)\)/g;
    //     const urls = [];
    //     let match;
    //     while ((match = urlRegex.exec(markdownContent)) !== null) {
    //         urls.push(match[1]);
    //     }
    //     return urls;
    // };

    // const onImageUpload = async (postId, file) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('file', file);
    //         const response = await api.post(`/posts/${postId}/attachments`, formData);
    //         return response.data.fileURL
    //     } catch (error) {
    //         console.error('Image upload error:', error);
    //         alert(error.message);
    //         return null;
    //     }
    // };

    const handleAttachments = async (postId, content) => {
        if (content?.includes('![')) {
            const imageUrls = extractImageUrls(content);
            await Promise.all(
                imageUrls.map(async (url) => {
                    try {
                        await api.post(`/posts/${postId}/attachments`, {url});
                    } catch (error) {
                        console.error("이미지 첨부 처리 오류:", error);                
                    }
                })
            );
        }
    };

    const validatePost = (postData) => {
        if(!postData.title.trim()) {
            alert('제목을 입력해주세요.');
            return false;
        }
        if(!postData.content.trim()) {
            alert('내용을 입력해주세요.');
            return false;
        }
        return true;
    }

    const onCancel = () => {
        navigate(-1);
    };

    return {
        categoryOptions,
        onImageUpload,
        handleAttachments,
        validatePost,
        navigate,
        onCancel
    };
}