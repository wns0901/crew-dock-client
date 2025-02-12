import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Direction, DirectionLabel } from '../constants/Direction';
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

const ProjectPostForm = ({
  initialData = { category: '', title: '', content: '', direction: 'NONE' },
  isEdit = false,
  onSubmit = () => {},
  onCancel = () => {},
  directionOptions = []
}) => {
  const [direction, setDirection] = useState(initialData.direction);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  useEffect(() => {
    setDirection(initialData.direction);
    setTitle(initialData.title);
    setContent(initialData.content);
}, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({direction, title, content});
  }

  return (
    <Container maxWidth="lg">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-label">카테고리</InputLabel>
              <Select
                labelId="category-label"
                value={direction}
                label="카테고리"
                onChange={(e) => setDirection(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>카테고리</em>
                </MenuItem>
                {directionOptions.map(dir => (
                  <MenuItem key={dir} value={dir}>
                    {DirectionLabel[dir]}
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
              height={400}
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

ProjectPostForm.propTypes = {
    initialData: PropTypes.shape({
        direction: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string
    }),
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onImageUpload: PropTypes.func,
    directionOptions: PropTypes.arrayOf(
        PropTypes.oneOf(Object.values(Direction))
    )
};

export default ProjectPostForm;