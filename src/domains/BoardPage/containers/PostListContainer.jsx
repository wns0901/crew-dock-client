import { useEffect, useMemo, useState } from "react";
import PostList from "../components/PostList";
import { Category } from "../\bconstants/\bCategory";
import api from "../../../apis/baseApi";

const PostListContainers = () => {
    const [posts, setPosts] = useState([]);
    const [notices, setNotices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(Category.NONE);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        type: 'title',
        query: ''
    });
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const [noticeResponse, postsResponse] = await Promise.all([
                    api.get(`/posts`, { params: { category: 'NOTICE' } }),
                    api.get(`/posts`, { params: { category: selectedCategory } })
                ]);

                const noticesPosts = noticeResponse.data.posts?.post || [];
                const categoryPosts = postsResponse.data.posts?.post || [];

                setNotices(noticesPosts);
                setPosts(categoryPosts);
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategory]);

    const filteredPosts = useMemo(() => {
        const combined = [...notices, ...posts];
        if (!searchParams.query) return combined;

        return combined.filter(post => {
            if (searchParams.type === 'title') {
                return post.title.toLowerCase().includes(searchParams.query.toLowerCase());
            } else if (searchParams.type === 'userNickname') {
                return post.userNickname?.toLowerCase().includes(searchParams.query.toLowerCase());
            }
            return true;
        });
    }, [notices, posts, searchParams]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);

        return {
            paginatedPosts,
            pagination: {
                totalPages,
                totalElements: filteredPosts.length,
                currentPage,
                pageSize: PAGE_SIZE
            }
        };
    }, [filteredPosts, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchData) => {
        setSearchParams(searchData);
        setCurrentPage(1);
    };
    

    return (
        <PostList
            posts={paginatedData.paginatedPosts}
            loading={loading}
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            pagination={paginatedData.pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
        />
    );
}

export default PostListContainers;