import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/baseApi";
import { Direction } from "../constants/Direction";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }) + " " + date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const ProjectNoticeList = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });

    useEffect(() => {
        const fetchNoticePosts = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/projects/${projectId}/posts`, {
                    params: {
                        page: currentPage - 1,
                        size: pagination.pageSize,
                        direction: Direction.NOTICE
                    }
                });

                setPosts(response.data.posts.post);
                setPagination({
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageSize: response.data.pageSize
                });
            } catch (error) {
                console.error("공지사항 게시글 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticePosts();
    }, [currentPage]);

    const handlePostClick = (postId) => {
        navigate(`/projects/${projectId}/posts/${postId}`);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📢 공지사항</h2>
            {loading ? (
                <p style={{ textAlign: "center" }}>로딩 중...</p>
            ) : posts.length === 0 ? (
                <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>공지사항이 없습니다.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {posts.map((post, index) => (
                        <li 
                            key={post.id} 
                            onClick={() => handlePostClick(post.id)}
                            style={{
                                cursor: "pointer",
                                padding: "10px 15px",
                                borderBottom: "1px solid #ddd",
                                transition: "background 0.2s",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                        >
                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{index + 1}. {post.title}</span>
                            <span style={{ fontSize: "14px", color: "#888", fontWeight: "bold" }}>{formatDate(post.createdAt)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectNoticeList;
