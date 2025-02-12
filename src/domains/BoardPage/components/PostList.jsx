import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryLabel } from '../constants/Category';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { 
    Box, 
    Stack,
    Button, 
    Container, 
    Typography, 
    TextField, 
    Select, 
    MenuItem, 
    Card, 
    CardContent, 
    Chip,
    CircularProgress,
    InputAdornment,
    IconButton
  } from '@mui/material';

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
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Stack spacing={3} my={4}>
                <Box display="flex" justifyContent="flex-end">
                    <Button 
                        variant="contained" 
                        startIcon={<EditIcon />} 
                        onClick={handleCreateClick}
                    >
                        글쓰기
                    </Button>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                    <Box display="flex" gap={1}>
                        <Button
                            variant={selectedCategory === 'NONE' ? 'contained' : 'outlined'}
                            onClick={() => setSelectedCategory('NONE')}
                        >
                            {CategoryLabel.NONE}
                        </Button>
                        <Button
                            variant={selectedCategory === 'FORUM' ? 'contained' : 'outlined'}
                            onClick={() => setSelectedCategory('FORUM')}
                        >
                            {CategoryLabel.FORUM}
                        </Button>
                    </Box>

                    <Box component="form" onSubmit={handleSearch} display="flex" gap={1} flexGrow={1}>
                        <Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            size="small"
                        >
                            <MenuItem value="title">제목</MenuItem>
                            <MenuItem value="userNickname">닉네임</MenuItem>
                        </Select>
                        <TextField
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='검색어를 입력하세요'
                            size="small"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton type="submit">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Stack>

                <Stack spacing={2}>
                    {posts.map(post => (
                        <Card key={post.id} onClick={() => handlePostClick(post.id)}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Chip label={CategoryLabel[post.category]} color="primary" size="small" />
                                    <Typography variant="caption">{post?.createdAt}</Typography>
                                </Box>
                                <Typography variant="h6" gutterBottom>{post.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{post?.userNickname}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Box display="flex" justifyContent="center" mt={2}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                            key={page}
                            onClick={() => onPageChange(page)}
                            variant={pagination.currentPage === page ? 'contained' : 'outlined'}
                            size="small"
                            sx={{ mx: 0.5 }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
            </Stack>
        </Container>
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