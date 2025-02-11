import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Category, CategoryLabel } from '../constants/Category';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const PostList = ({
    posts,
    loading,
    selectedCategory,
    setSelectedCategory,
    pagination
}) => {
    const {roles} = useContext(LoginContext);

    console.log("전체 Posts:", posts);
    console.log("선택된 카테고리:", selectedCategory);

    const categoryOptions = Object.values(Category).filter(category => {
        const isAdmin = roles?.isAdmin ?? false;
        if (isAdmin) {
            return true;
        }
       return category === Category.NONE || category === Category.FORUM;
    }); 
    
    if(loading) return <div>로딩 중...</div>

    const filteredPosts = selectedCategory
        ? posts.filter(post => {
            console.log(`Post Category Check - Post ID: ${post.id}, Category: ${post.category}, Selected: ${selectedCategory}`);
            return post.category === selectedCategory; })
        : posts;
    console.log("filteredPosts", filteredPosts);
    
    return (
        <div>
            <div className='category-buttons'>
            {categoryOptions.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'active' : ''}
                >
                    {CategoryLabel[category]}
                </button>
                ))}
            </div>

            <div className='post-list'>
                {filteredPosts.map(post => (
                    <div key={post.id} className='post-item'>
                        <span className='notice-badge'>{CategoryLabel[post.category]}</span>
                        <h3>{post.title}</h3>
                        <div className='post-info'>
                            <span>{post?.userNickname}</span>
                            <span>{post?.createdAt}</span>
                        </div>
                    </div>
                ))}
            </div>
            {pagination && (
                <div className='pagination'>
                <p>총 게시물 수: {pagination.totalElements}</p>
                <p>현재 페이지: {pagination.currentPage}</p>
                <p>총 페이지 수: {pagination.totalPages}</p>
                </div>
            )}
        </div>
    );
};

PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string,
        user: PropTypes.shape({
          nickname: PropTypes.string
        }),
        createAt: PropTypes.string
      })).isRequired,
    loading: PropTypes.bool.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired,
    pagination: PropTypes.shape({
        totalPages: PropTypes.number,
        totalElements: PropTypes.number,
        currentPage: PropTypes.number,
        pageSize: PropTypes.number
    })
};

export default PostList;