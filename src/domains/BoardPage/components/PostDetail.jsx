import React, { useState } from 'react';
import { useGetNickname } from '../hooks/useGetNickname';
import PropTypes from 'prop-types';

const PostDetail = ({
    post,
    comments, 
    onUpdatePost,
    onDeletePost,
    onSubmitComment,
    onFixedComment,
    onDeleteComment,
    userInfo
}) => {
    const getNicknameById = useGetNickname(userInfo);
    const [comment, setComment] = useState('');
    const isAuthor = post?.userId === userInfo?.id;
    const isCommentUser = comment.userId === userInfo?.id;

    const handleSubmitComment = () => {
        onSubmitComment(comment);
        setComment('');
    };

    return (
        <div className='post-detail'>
            <div className='post-category'>{post?.category}</div>
            <h1>{post?.title}</h1>
            <div className='post-info'>
                <div>
                    <span>{getNicknameById(post?.userId)}</span>
                    <span>{post?.createAt}</span>
                </div>
                {isAuthor && (
                    <div>
                        <button type='button' onClick={onUpdatePost}></button>
                        <button type='button' onClick={onDeletePost}></button>
                    </div>
                )}
            </div>
            {/* line */}
            <div className='post-content'>{post?.content}</div>
            <div className='comment-count'>댓글 수: {comment.count}</div>
            {/* line */}
            <input
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='댓글을 입력하세요'
            />
            <button type='button' onClick={handleSubmitComment}>댓글작성</button>
            {/* line */}
            <h3>댓글</h3>
            <div className='comment-list'>
                {comments.map(comment => (
                    <CommentItem
                    key={comment.id}
                    comment={comment}
                    isAuthor={isAuthor}
                    isCommentUser={isCommentUser}
                    onFixedComment={onFixedComment}
                    onDeleteComment={onDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

const CommentItem = ({ 
    comment, 
    isAuthor, 
    isCommentUser, 
    onFixedComment, 
    onDeleteComment 
 }) => (
    <div className='comment-item'>
        <div>{comment.userNickname}</div>
        <div>{comment.content}</div>
        <div className='comment-footer'>
            {isAuthor && (
                <button onClick={() => onFixedComment(comment.id)}>
                    고정
                </button>
            )}
            {isCommentUser && (
                <button onClick={() => onDeleteComment(comment.id)}>
                    삭제
                </button>
            )}
            <span>{comment.createdAt}</span>
        </div>
    </div>
 );

 PostDetail.propTypes = {
    post: PropTypes.object.isRequired,
    comments: PropTypes.array, 
    comment: PropTypes.object, 
    onUpdatePost: PropTypes.func,
    onDeletePost: PropTypes.func,
    onSubmitComment: PropTypes.func.isRequired,
    onFixedComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    userInfo: PropTypes.array.isRequired
 };

 CommentItem.propTypes = {
    comment: PropTypes.object,
    isAuthor: PropTypes.bool,
    isCommentUser: PropTypes.bool,
    onFixedComment: PropTypes.func, 
    onDeleteComment: PropTypes.func
 };

export default PostDetail;