import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryLabel } from '../constants/Category';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import '../styles/PostList.css';

const PostList = ({
    posts,
    loading,
    selectedCategory,
    setSelectedCategory,
    pagination,
    onPageChange,
    onSearch
}) => {
    const { roles } = useContext(LoginContext);
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState('title');
    const [searchQuery, setSearchQuery] = useState('');

    // const categoryOptions = Object.values(Category).filter(category => {
    //     const isAdmin = roles?.isAdmin ?? false;
    //     if (isAdmin) {
    //         return true;
    //     }
    //     return category === Category.NONE || category === Category.FORUM;
    // });

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({type: searchType, query: searchQuery});
    }

    const handleCreateClick = () => {
        navigate('/posts/create');
    };

    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    if (loading) {
        return <div className="loading-spinner">로딩 중...</div>;
    }

    return (
        <div className='post-container'>
            <button className="write-button" onClick={handleCreateClick}>
                    <span className="write-icon">✎</span> 글쓰기
            </button>

            <div className="control-section">
                <div className='category-buttons'>
                    <button
                        className={`category-button primary ${selectedCategory === 'NONE' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('NONE')}
                    >
                        {CategoryLabel.NONE}
                    </button>
                    <button
                        className={`category-button secondary ${selectedCategory === 'FORUM' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('FORUM')}
                    >
                        {CategoryLabel.FORUM}
                    </button>
                </div>
                <div className='search-section'>
                    <form onSubmit={handleSearch} className='search-form'>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className='search-type'
                        >
                            <option value="title">제목</option>
                            <option value="userNickname">닉네임</option>
                        </select>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='검색어를 입력하세요'
                            className='search-input'
                        />
                        <button type='submit' className='search-button'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>
                </div>
            </div>

            <div className='post-list'>
                {posts.map(post => (
                    <div 
                        key={post.id} 
                        className='post-item'
                        onClick={() => handlePostClick(post.id)}
                    >
                        <span className="notice-badge">{CategoryLabel[post.category]}</span>
                        <h3 className="post-title">{post.title}</h3>
                        <div className='post-info'>
                            <span className="user-nickname">{post?.userNickname}</span>
                            <span className="created-at">{post?.createdAt}</span>
                        </div>
                    </div>
                ))}
            </div>
           
            <div className="bottom-section">
                <div className="pagination-simple">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`page-number ${pagination.currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            
            </div>
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
    }),
    onPageChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};

export default PostList;