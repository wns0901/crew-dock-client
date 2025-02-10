import { useEffect, useMemo, useState } from "react";
import PostList from "../components/PostList";
import { Category } from "../\bconstants/\bCategory";

const PostListContainers = () => {
    const [posts, setPosts] = useState([]);
    const [notices, setNotices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(Category.NONE);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const [noticeResponse, postsResponse] = await Promise.all([
                    fetch(`/posts?category=NOTICE`),
                    fetch(`/posts?category=${selectedCategory}`)
                ]);

                const noticeData = await noticeResponse.json();
                const postsData = await postsResponse.json();

                setNotices(noticeData);
                setPosts(postsData);
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
        />
    );
}

export default PostListContainers;