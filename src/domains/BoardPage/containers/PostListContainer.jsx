import { useEffect, useState } from "react";

import api from "../../../apis/baseApi";
import PostList from "../components/PostList";
import { Category } from "../constants/Category";

const PostListContainers = () => {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        type: 'title',
        query: ''
    });
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
                let response;
                let postData = [];
                
                if (selectedCategory === '') {
                    const responses = await Promise.all(
                        Object.values(Category).map(category => 
                            api.get('/posts', { 
                                params: { 
                                    page: 0, 
                                    size: 1000, 
                                    category: category,
                                    searchType: searchParams.type,
                                    keyword: searchParams.query
                                } 
                            })
                        )
                    );

                    postData = responses.flatMap(response => response.data.posts.post);
                } else {
                    response = await api.get('/posts', { 
                        params: { 
                            page: currentPage - 1,
                            size: pagination.pageSize,
                            category: selectedCategory,
                            searchType: searchParams.type,
                            keyword: searchParams.query
                        } 
                    });
                    
                    postData = response.data.posts.post;
                    
                    setPagination({
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        currentPage: response.data.currentPage,
                        pageSize: response.data.pageSize
                    });
                }

                const filteredPosts = postData.filter(post => {
                    if (!searchParams.query) return true;
    
                    if (searchParams.type === 'title') {
                        return post.title.toLowerCase().includes(searchParams.query.toLowerCase());
                    } else if (searchParams.type === 'userNickname') {
                        return post.userNickname?.toLowerCase().includes(searchParams.query.toLowerCase());
                    }
                    return true;
                });

                if (selectedCategory === '') {
                    const startIndex = (currentPage - 1) * pagination.pageSize;
                    const endIndex = startIndex + pagination.pageSize;
                    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
                    
                    setPosts(paginatedPosts);
                    setPagination(prev => ({
                        ...prev,
                        totalPages: Math.ceil(postData.length / prev.pageSize),
                        totalElements: filteredPosts.length,
                        currentPage: currentPage
                    }));
                } else {
                    setPosts(filteredPosts);
                }
            } catch (error) {
                console.error('게시글 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategory, currentPage, searchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchData) => {
        console.log('검색 데이터:', searchData);
        setSearchParams(searchData);
        setCurrentPage(1);
    };
    
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);

        setSearchParams({
            type: 'title',
            query: ''
        });
    };

    return (
        <PostList
            posts={posts}
            loading={loading}
            selectedCategory={selectedCategory} 
            setSelectedCategory={handleCategoryChange}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
        />
    );
}

export default PostListContainers;
