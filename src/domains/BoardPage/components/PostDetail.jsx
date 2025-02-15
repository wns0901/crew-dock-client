import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { CategoryLabel } from '../constants/Category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { Stack, Box, Button, TextField, Typography, Divider } from '@mui/material';

const PostDetail = ({
    post = null, 
    comments = [], 
    fixedComment = null,
    onUpdatePost = () => {}, 
    onDeletePost = () => {}, 
    onSubmitComment, 
    onFixedComment = () => {}, 
    onDeleteComment = () => {},
    userInfo = null,
    getTotalCommentsCount = () => {},
}) => {
    const [comment, setComment] = useState({ content: '' });
    const isAuthor = post?.userId === userInfo?.id;

    const handleSubmitComment = () => {
        if (comment.content.trim()) {
            onSubmitComment({
                content: comment.content,
                parentComment: null
            }, userInfo);
            setComment({ content: '' });
        }
    };

    if (!userInfo) {
        return <Typography variant="body1">로그인 후 댓글을 작성할 수 있습니다.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '100%', maxWidth: 800 }}>
                <Stack spacing={3}>
                    {/* 카테고리 */}
                    <Typography variant="h6" className="post-category">
                        {CategoryLabel[post?.category]}
                    </Typography>

                    {/* 제목 */}
                    <Typography variant="h4">{post?.title}</Typography>

                    {/* 작성자 정보 */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                    }}>
                        <Typography variant="body2">
                            {post?.userNickname} | {post?.createdAt}
                        </Typography>
                        
                        {isAuthor && (
                            <Box>
                                <Button 
                                    onClick={onUpdatePost}
                                    startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                                >
                                    수정
                                </Button>
                                <Button 
                                    onClick={onDeletePost}
                                    startIcon={<FontAwesomeIcon icon={faTrashCan} />}
                                    color="error"
                                >
                                    삭제
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* 본문 */}
                    <Box>
                        <MarkdownRenderer content={post?.content} />
                        <Typography variant="body2" align="right">
                            댓글 수: {getTotalCommentsCount(comments)}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* 댓글 입력 */}
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={comment.content}
                            onChange={(e) => setComment({ ...comment, content: e.target.value })}
                            placeholder="댓글을 입력하세요"
                            margin="normal"
                        />
                        <Button 
                            fullWidth
                            variant="contained" 
                            onClick={handleSubmitComment}
                        >
                            댓글 작성
                        </Button>
                    </Stack>

                    {/* 댓글 목록 */}
                    <Stack spacing={2}>
                        <Typography variant="h5">댓글</Typography>
                        {fixedComment && (
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>고정된 댓글</Typography>
                                <CommentItem
                                    key={`fixed-${fixedComment.id}`}
                                    comment={fixedComment}
                                    comments={comments}
                                    isAuthor={post?.userId === userInfo?.id}
                                    isCommentUser={fixedComment.userId === userInfo?.id}
                                    onFixedComment={onFixedComment}
                                    onDeleteComment={onDeleteComment}
                                    onSubmitComment={onSubmitComment}
                                    userInfo={userInfo}
                                />
                            </Box>
                        )}

                        {comments.filter(comment => !comment.parentComment).length > 0 ? (
                            comments.filter(comment => !comment.parentComment).map(comment => (
                                <CommentItem
                                    key={`comment-${comment.id}`}
                                    comment={comment}
                                    isAuthor={isAuthor}
                                    isCommentUser={comment.userId === userInfo.id}
                                    onFixedComment={onFixedComment}
                                    onDeleteComment={onDeleteComment}
                                    onSubmitComment={onSubmitComment}
                                    userInfo={userInfo}
                                    allComments={comments}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" align="center">
                                댓글이 아직 없습니다.
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

const CommentItem = ({ 
    comment,
    comments = [],
    isAuthor, 
    isCommentUser, 
    onFixedComment, 
    onDeleteComment,
    onSubmitComment,
    userInfo,
    isReply = false
}) => {
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const childComments = (comment.childComments || []).filter(c => c.parentsId === comment.id && !c.deleted);
    
    const handleSubmitReply = () => {
        if (replyContent.trim()) {
            onSubmitComment({
                content: replyContent,
                parentComment: { id: comment.id },
                fixed: false,
            }, userInfo);    
            setReplyContent('');
            setShowReplyForm(false);
        }
    };

    if (comment.deleted && childComments.length === 0) {
        return null;
    }

    return (
        <Box sx={{ py: 2 }}>
            <Stack spacing={1}>
                {comment.deleted ? (
                    <Typography variant="body2" color="textSecondary">삭제된 댓글입니다.</Typography>
                ) : (
                    <>
                        <Typography variant="subtitle2">{comment.userNickname}</Typography>
                        <Typography variant="body1">{comment.content}</Typography>
                    </>
                )}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <Typography variant="caption">{comment.createdAt}</Typography>
                    <Box>
                        <>
                            {!comment.deleted && (
                                <>
                                    {isAuthor && (
                                        <Button 
                                            size="small" 
                                            onClick={() => onFixedComment(comment.id)}
                                        >
                                            고정
                                        </Button>
                                    )}
                                    {(isCommentUser || isAuthor) && (
                                        <Button 
                                            size="small" 
                                            color="error"
                                            onClick={() => onDeleteComment(comment.id)}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                </>
                            )}
                            {/* 답글 버튼은 항상 표시되게 함 */}
                            {!isReply && (
                                <Button 
                                    size="small"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                >
                                    답글
                                </Button>
                            )}
                        </>
                        {/* 자식 댓글 보기/숨기기 버튼 */}
                        {!isReply && childComments.length > 0 && (
                            <Button 
                                size="small"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? '답글 숨기기' : `답글 ${childComments.length}개 보기`}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Stack>

            {!isReply && showReplyForm && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 입력하세요"
                    />
                    <Button onClick={handleSubmitReply}>답글 작성</Button>
                </Box>
            )}

            {!isReply && showReplies && childComments && childComments.map(childComment => (
                <CommentItem
                    key={`child-comment-${childComment.id}`}
                    comment={childComment}
                    comments={comments}
                    isAuthor={isAuthor}
                    isCommentUser={childComment.userId === userInfo.id}
                    onFixedComment={onFixedComment}
                    onDeleteComment={onDeleteComment}
                    onSubmitComment={onSubmitComment}
                    userInfo={userInfo}
                    allComments={comments}
                    isReply={true}
                />
            ))}
        </Box>
    );
};

 PostDetail.propTypes = {
    post: PropTypes.object,
    comments: PropTypes.array, 
    onUpdatePost: PropTypes.func,
    onDeletePost: PropTypes.func,
    onSubmitComment: PropTypes.func.isRequired,
    onFixedComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    userInfo: PropTypes.object.isRequired,
    fixedComment: PropTypes.object,
    getTotalCommentsCount: PropTypes.func
 };

 CommentItem.propTypes = {
    comment: PropTypes.object,
    comments: PropTypes.array, 
    isAuthor: PropTypes.bool,
    isCommentUser: PropTypes.bool,
    onFixedComment: PropTypes.func, 
    onDeleteComment: PropTypes.func,
    onSubmitComment: PropTypes.func,
    userInfo: PropTypes.object,
    allComments: PropTypes.array,
    isReply: PropTypes.bool
};

export default PostDetail;
export { CommentItem };