import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Category, CategoryLabel } from '../constants/Category';
// import '../styles/PostFormStyle.css';
import { 
    Box, 
    Stack,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Container
  } from '@mui/material';
import { customCommands } from '../../../utils/mdEditorCustomImgIcon';

const PostForm = ({
  initialData = { category: '', title: '', content: '', direction: 'NONE' },
  isEdit = false,
  onSubmit = () => {},
  onCancel = () => {},
  categoryOptions = []
}) => {
  const [category, setCategory] = useState(initialData.category);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  useEffect(() => {
    setCategory(initialData.category);
    setTitle(initialData.title);
    setContent(initialData.content);
}, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({category, title, content});
  }

  return (
    <Container maxWidth="lg" style={{marginBottom: '30px'}}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-label">카테고리</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="카테고리"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>카테고리</em>
                </MenuItem>
                {categoryOptions.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {CategoryLabel[cat]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              제목
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              variant="outlined"
            />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              내용
            </Typography>
            <MDEditor
              value={content}
              onChange={setContent}
              commands={customCommands}
              preview="live"
              data-color-mode="light"
              height={600}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              취소
            </Button>
            <Button variant="contained" type="submit">
              {isEdit ? '수정완료' : '작성완료'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

PostForm.propTypes = {
    initialData: PropTypes.shape({
        category: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string
    }),
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onImageUpload: PropTypes.func,
    categoryOptions: PropTypes.arrayOf(
        PropTypes.oneOf(Object.values(Category))
    )
};

export default PostForm;
