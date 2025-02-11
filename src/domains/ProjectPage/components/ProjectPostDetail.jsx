import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRederer';
import '../styles/ProjectPostDetail.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { DirectionLabel } from '../constants/Direction';

const ProjectPostDetail = ({
    post = null, 
    comments = [], 
    onUpdatePost = () => {}, 
    onDeletePost = () => {}, 
    onSubmitComment, 
    onFixedComment = () => {}, 
    onDeleteComment = () => {},
    userInfo
}) => {
    const [comment, setComment] = useState({ content: '', userId: userInfo?.id });
    const isAuthor = post?.userId === userInfo?.id;
    const isCommentUser = comment.userId === userInfo?.id;

    const handleSubmitComment = () => {
        if (comment.content.trim()) {
        onSubmitComment(comment);
        setComment({ content: '', userId: userInfo?.id });
        }
    };

    if (!userInfo) {
        return <div>로그인 후 댓글을 작성할 수 있습니다.</div>;
    }

    return (
        <div className='post-detail'>
            <div className='post-category'>{DirectionLabel[post?.direction]}</div>
            <h1>{post?.title}</h1>
            <div className='post-info'>
                <div>
                    <span>{(post?.userNickname)}</span>
                    <span>{post?.createdAt}</span>
                </div>
                {isAuthor && (
                    <div>
                        <button type='button' onClick={onUpdatePost}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button type='button' onClick={onDeletePost}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                )}
            </div>
            {/* line */}
            <div className='post-content'>
                <MarkdownRenderer content={post?.content} />
                <div className='comment-count'>댓글 수: {comments.length}</div>
            </div>
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
                {comments.lengh > 0 ? (
                comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        isAuthor={isAuthor}
                        isCommentUser={isCommentUser}
                        onFixedComment={onFixedComment}
                        onDeleteComment={onDeleteComment}
                    />
                ))
                ) : (
                    <div className='no-comments'>댓글이 아직 없습니다.</div>
                )}
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

 ProjectPostDetail.propTypes = {
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

export default ProjectPostDetail;
export { CommentItem };
