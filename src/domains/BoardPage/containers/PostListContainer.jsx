import { useEffect, useMemo, useState } from "react";
import PostList from "../components/PostList";
import { Category } from "../\bconstants/\bCategory";
import api from "../../../apis/baseApi";

const PostListContainers = () => {
    const [posts, setPosts] = useState([]);
    const [notices, setNotices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(Category.NONE);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalElements: 0,
        currentPage: 1,
        pageSize: 10
      });

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const [noticeResponse, postsResponse] = await Promise.all([
                    api.get(`/posts`, { params: { category: 'NOTICE' } }),
                    api.get(`/posts`, { params: { category: selectedCategory } })
                ]);

                console.log("공지사항 응답:", noticeResponse.data);
                console.log("게시글 응답:", postsResponse.data);

                const noticesPosts = noticeResponse.data.posts?.post || [];
                const categoryPosts = postsResponse.data.posts?.post || [];

                console.log("공지사항 목록:", noticesPosts);
                console.log("카테고리 게시글 목록:", categoryPosts);

                setNotices(noticesPosts);
                setPosts(categoryPosts);

                setPagination({
                    totalPages: postsResponse.data.totalPages,
                    totalElements: postsResponse.data.totalElements,
                    currentPage: postsResponse.data.currentPage,
                    pageSize: postsResponse.data.pageSize
                });
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategory]);

    const combinedPosts = useMemo(() => {
        return [...notices, ...posts];
    }, [notices, posts]);

    return (
        <PostList
            posts={combinedPosts}
            loading={loading}
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            pagination={pagination}
        />
    );
}

export default PostListContainers;