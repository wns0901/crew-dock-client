import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { DirectionLabel } from '../constants/Direction';
import MarkdownRenderer from './MarkdownRenderer';

const ProjectPostDetail = ({
    post = null,
    comments = [],
    fixedComment = null,
    onUpdatePost = () => { },
    onDeletePost = () => { },
    onSubmitComment,
    onFixedComment = () => { },
    onDeleteComment = () => { },
    onDownloadAttachment = () => { },
    userInfo = null,
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
                    <Typography variant="h6" className="post-direction">
                        {DirectionLabel[post?.direction]}
                    </Typography>

                    <Typography variant="h4">{post?.title}</Typography>

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

                    {/* 첨부파일 및 이미지 표시 */}
                    {post?.attachments?.length > 0 && (
                        <Box sx={{ position: 'relative', zIndex: 1000, overflow: 'visible' }}>
                            <Typography variant="h6">첨부 파일</Typography>
                            <Stack spacing={1}>
                                {post.attachments.map((attachment, index) =>
                                (<Box key={index}>
                                    <Button onClick={() => onDownloadAttachment(attachment.id, attachment.fileName)}>
                                        {attachment.fileName}
                                    </Button>
                                </Box>)
                                )}
                            </Stack>
                        </Box>
                    )}


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

    const childComments = comments.filter(c => c.parentsId === comment.id);

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
                    {!comment.deleted && (
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
                    )}
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

            {!isReply && showReplies && comment.childComments && comment.childComments.map(childComment => (
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
                    isReply={true}
                />
            ))}
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
    onDownloadAttachment: PropTypes.func,
    userInfo: PropTypes.object.isRequired,
    fixedComment: PropTypes.object
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

export default ProjectPostDetail;
export { CommentItem };
