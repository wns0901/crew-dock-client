import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { Stack, Box, Button, TextField, Typography, Divider } from '@mui/material';
import { DirectionLabel } from '../constants/Direction';

const ProjectPostDetail = ({
    post = null, 
    comments = [], 
    fixedComment = null,
    onUpdatePost = () => {}, 
    onDeletePost = () => {}, 
    onSubmitComment, 
    onFixedComment = () => {}, 
    onDeleteComment = () => {},
    userInfo = null,
}) => {
    const [comment, setComment] = useState({ content: '' });
    const isAuthor = post?.userId === userInfo?.id;

    const handleSubmitComment = () => {
        if (comment.content.trim()) {
            onSubmitComment(comment);
            setComment({ content: ''});
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
                        {DirectionLabel[post?.direction]}
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
                            댓글 수: {comments.length}
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
                            comments.filter(comment => !comment.parentComment).map(comment => {
                                const childComments = comments.filter(c => 
                                    (c.parentComment && c.parentComment.id === comment.id) || 
                                    (c.parentComment === comment.id)
                                );
                        
                                return (
                                    <CommentItem
                                        key={`comment-${comment.id}`}
                                        comment={{
                                            ...comment,
                                            childComments: childComments
                                        }}
                                        isAuthor={isAuthor}
                                        isCommentUser={comment.userId === userInfo.id}
                                        onFixedComment={onFixedComment}
                                        onDeleteComment={onDeleteComment}
                                        onSubmitComment={onSubmitComment}
                                        userInfo={userInfo}
                                    />
                                );
                            })
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

    const handleSubmitReply = () => {
        console.log('답글 작성 시도:', {
            content: replyContent,
            parentsId: comment.id,
            userInfo: userInfo
        });
        if (replyContent.trim()) {
            onSubmitComment({
                content: replyContent,
                parentsId: comment.id
            }, userInfo);
            setReplyContent('');
            setShowReplyForm(false);
        }
    };

    if (comment.deleted && (!comment.childComments || comment.childComments.length === 0)) {
        return null; 
    }

    return (
        <Box sx={{ py: 2 }}>
            <Stack spacing={1}>
                <Typography variant="subtitle2">{comment.userNickname}</Typography>
                {comment.deleted ? (
                    <Typography variant="body2" color="textSecondary">삭제된 댓글입니다.</Typography>
                ) : (
                    <Typography variant="body1">{comment.content}</Typography>
                )}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <Typography variant="caption">{comment.createdAt}</Typography>
                    <Box>
                        {!comment.deleted && (
                            <>
                                {isAuthor && !comment.fixed && (
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
                                {!isReply && (
                                    <Button 
                                        size="small"
                                        onClick={() => setShowReplyForm(!showReplyForm)}
                                    >
                                        답글
                                    </Button>
                                )}
                            </>
                        )}
                        {!isReply && comment.childComments && comment.childComments.length > 0 && (
                            <Button 
                                size="small"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? '답글 숨기기' : `답글 ${comment.childComments.length}개 보기`}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Stack>

            {!isReply && showReplyForm && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 입력하세요"
                        margin="normal"
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleSubmitReply}
                    >
                        답글 작성
                    </Button>
                </Box>
            )}
            {!isReply && showReplies && comment.childComments && (
                <Box sx={{ pl: 4, mt: 2 }}>
                    {comment.childComments.map(childComment => (
                        <CommentItem
                            key={`child-${childComment.id}`}
                            comment={childComment}
                            isAuthor={isAuthor}
                            isCommentUser={childComment.userId === userInfo.id}
                            onFixedComment={onFixedComment}
                            onDeleteComment={onDeleteComment}
                            onSubmitComment={onSubmitComment}
                            userInfo={userInfo}
                            isReply={true}
                        />
                    ))}
                </Box>
            )}
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

 ProjectPostDetail.propTypes = {
    post: PropTypes.object,
    comments: PropTypes.array, 
    onUpdatePost: PropTypes.func,
    onDeletePost: PropTypes.func,
    onSubmitComment: PropTypes.func.isRequired,
    onFixedComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    userInfo: PropTypes.object.isRequired,
    fixedComment: PropTypes.object
 };

 CommentItem.propTypes = {
    comment: PropTypes.object,
    isAuthor: PropTypes.bool,
    isCommentUser: PropTypes.bool,
    onFixedComment: PropTypes.func, 
    onDeleteComment: PropTypes.func,
    onSubmitComment: PropTypes.func,
    userInfo: PropTypes.object,
    isReply: PropTypes.bool
};

export default ProjectPostDetail;
export { CommentItem };