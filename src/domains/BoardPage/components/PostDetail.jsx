import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useGetNickname } from '../hooks/useGetNickname';

const PostDetail = ({
    post = null, 
    comments = [], 
    onUpdatePost = () => {}, 
    onDeletePost = () => {}, 
    onSubmitComment, 
    onFixedComment = () => {}, 
    onDeleteComment = () => {},
    userInfo
}) => {
    if (!userInfo) {
        return <div>로그인 후 댓글을 작성할 수 있습니다.</div>;
    }

    const [comment, setComment] = useState({ content: '', userId: userInfo?.id });

    console.log(post);
    console.log(comments);

    const isAuthor = post?.userId === userInfo?.id;
    const isCommentUser = comment.userId === userInfo?.id;

    const handleSubmitComment = () => {
        if (comment.content.trim()) {
        onSubmitComment(comment);
        setComment({ content: '', userId: userInfo?.id });
        }
    };

    return (
        <div className='post-detail'>
            <div className='post-category'>{post?.category}</div>
            <h1>{post?.title}</h1>
            <div className='post-info'>
                <div>
                    <span>{(post?.userNickname)}</span>
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
            <div className='comment-count'>댓글 수: {comments.length}</div>
            {/* line */}
            <input
                type='text'
                value={comment.content}
                onChange={(e) => setComment({...comment, content: e.target.value})}
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
    post: PropTypes.object,
    comments: PropTypes.array, 
    onUpdatePost: PropTypes.func,
    onDeletePost: PropTypes.func,
    onSubmitComment: PropTypes.func.isRequired,
    onFixedComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    userInfo: PropTypes.object.isRequired
 };

 CommentItem.propTypes = {
    comment: PropTypes.object,
    isAuthor: PropTypes.bool,
    isCommentUser: PropTypes.bool,
    onFixedComment: PropTypes.func, 
    onDeleteComment: PropTypes.func
 };

export default PostDetail;
export { CommentItem };
