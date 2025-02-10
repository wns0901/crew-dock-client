import React from 'react';
import { useGetNickname } from '../hooks/useGetNickname';
import { userInfo } from '../../../apis/auth';
import PropTypes from 'prop-types';
import { Category } from '../constants/Category';

const PostList = ({
    posts,
    loading,
    selectedCategory,
    setSelectedCategory
}) => {
    const getNicknameById = useGetNickname(userInfo);
    if(loading) return <div>로딩 중...</div>
    
    return (
        <div>
            <div className='category-buttons'>
                <button
                    onClick={() => setSelectedCategory(Category.NONE)}
                    className={selectedCategory === Category.NONE ? 'active' : ''}
                >
                    자유게시판
                </button>
                <button
                    onClick={() => setSelectedCategory(Category.FORUM)}
                    className={selectedCategory === Category.FORUM ? 'active' : ''}
                >
                    Q&A
                </button>
            </div>

            <div className='post-list'>
                {posts.map(post => (
                    <div key={post.id} className='post-item'>
                        {post.category === 'NOTICE' && (
                            <span className='notice-badge'>공지사항</span>
                        )}
                        <h3>{post.title}</h3>
                        <div className='post-info'>
                            <span>{getNicknameById(post?.userId)}</span>
                            <span>{post.createAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired
}

export default PostList;