import api from "../../../apis/baseApi";

export const useAttachments = () => {
    const createImgUrl = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/s3", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            console.error("Image upload error:", error);
            throw error;
        }
    };

    const saveExternalImageUrl = async (postId, url) => {
        try {
            const response = await api.post(`/posts/${postId}/attachments`, {url});
            return response.data;
        } catch (error) {
            console.error("External image URL save error:", error);
            throw error;
        }
    }

    const extractImageUrls = (content) => {
        const urlRegex = /!\[.*?\]\((.*?)\)/g;
        const urls = [];
        let match;
        while ((match = urlRegex.exec(content)) !== null) {
          urls.push(match[1]);
        }
        return urls;
    };

    const base64ToFile = (base64String) => {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], 'image', { type: mime });
    };

    return {
        createImgUrl,
        saveExternalImageUrl,
        extractImageUrls,
        base64ToFile
    }
}