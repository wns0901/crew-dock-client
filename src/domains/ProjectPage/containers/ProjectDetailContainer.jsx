import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { useComments } from "../hooks/useComments";
import api from "../../../apis/baseApi";
import ProjectPostDetail from "../components/ProjectPostDetail";

const ProjectDetailContainer = () => {
    const {postId, projectId} = useParams();
    const [post, setPost] = useState(null);
    const {userInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const { 
        comments,
        fixedComment, 
        onSubmitComment, 
        onFixedComment, 
        onDeleteComment 
    } = useComments(postId);

    useEffect(() => {
        ( async () => {
            const data1 = await fetchPost();
            const data2 = await fetchAttachment();
            setPost({
                ...data1,
                attachments: data2
            })
        })();
    }, []);

    const fetchPost = async () => {
        try {
            return (await api.get(`/projects/${projectId}/posts/${postId}`)).data;
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    };

    const fetchAttachment = async () => {
        try {
               return (await (api.get(`/projects/${projectId}/posts/${postId}/attachments`))).data;
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    }

    const handleDownloadAttachment = (attachmentId, fileName) => {
        try {
            const response = api.get(`/projects/${projectId}/posts/${postId}/attachments/${attachmentId}`, 
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('첨부파일 다운로드 실패:', error);
        }
    };

    const onUpdatePost = async () => {
        if(window.confirm('게시글을 수정하시겠습니까?')) {
            navigate(`/projects/${projectId}/posts/${postId}/edit`)
        }
    };

    const onDeletePost = async () => {
        if(window.confirm('게시글을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/projects/${projectId}/posts/${postId}`);
                navigate(`/projects/${projectId}/posts`);
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
            }
        }
    };

    const handleSubmitComment = (comment) => {
        onSubmitComment(comment, userInfo);
    };
    

    return (
        <ProjectPostDetail
            post={post}
            comments={comments}
            fixedComment={fixedComment}
            userInfo={userInfo}
            onUpdatePost={onUpdatePost}
            onDeletePost={onDeletePost}
            onSubmitComment={handleSubmitComment}
            onFixedComment={onFixedComment}
            onDeleteComment={onDeleteComment}
            onDownloadAttachment={handleDownloadAttachment}
        />
    );
};

export default ProjectDetailContainer;