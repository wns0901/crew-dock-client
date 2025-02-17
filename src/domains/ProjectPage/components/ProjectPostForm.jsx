import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Direction, DirectionLabel } from '../constants/Direction';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
} from '@mui/material';
import { customCommands } from '../../../utils/mdEditorCustomImgIcon';

const ProjectPostForm = ({
  initialData = { category: '', title: '', content: '', direction: 'NONE', attachments: [] },
  isEdit = false,
  onSubmit = () => {},
  onCancel = () => {},
  directionOptions = []
}) => {
  const [direction, setDirection] = useState(initialData.direction);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [attachments, setAttachments] = useState(initialData.attachments || [])
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [tempAttachments, setTempAttachments] = useState([])


  useEffect(() => {
    setDirection(initialData.direction);
    setTitle(initialData.title);
    setContent(initialData.content);
    setAttachments(initialData.attachments || []);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("첨부파일 제출 직전 상태:", attachments); 
    onSubmit({ direction, title, content, attachments });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    console.log('files:', files);
    
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        type: 'file',
        name: file.name,
        file
      }));
      setTempAttachments([...tempAttachments, ...newAttachments]);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setTempAttachments([...tempAttachments, { type: 'url', url: urlInput }]);
      setUrlInput('');
    }
  };
  
  const handleRemoveTempAttachment = (index) => {
    setTempAttachments(tempAttachments.filter((_, i) => i !== index));
  };

  const handleSaveAttachments = () => {
    const newAttachments = [...attachments, ...tempAttachments];
    setAttachments(newAttachments);
    setTempAttachments([]);
    setFileDialogOpen(false);
    console.log('Form Data:', { direction, title, content, attachments });
  };

  return (
    <Container maxWidth="lg" style={{marginBottom: '30px'}}>
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
              height={500}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setFileDialogOpen(true)}>
              첨부파일 추가
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              취소
            </Button>
            <Button variant="contained" type="submit">
              {isEdit ? '수정완료' : '작성완료'}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        {attachments.map((item, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            {item.type === 'file' ? (
              <Typography variant="body2">{item.name}</Typography>
            ) : (
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
            )}
          </Stack>
        ))}
      </Box>

      <Dialog open={fileDialogOpen} onClose={() => {
        setTempAttachments([]);
        setFileDialogOpen(false);
        }}>
        <DialogTitle>첨부파일 추가</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" fullWidth startIcon={<CloudUploadIcon />}>
            파일 선택
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            label="이미지 URL 입력"
            variant="outlined"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleAddUrl} sx={{ mt: 2 }}>
            URL 추가
          </Button>
          <Box sx={{ mt: 2 }}>
            {tempAttachments.map((item, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                {item.type === 'file' ? (
                  <Typography variant="body2">{item.name}</Typography>
                ) : (
                  <Typography variant="body2">{item.url}</Typography>
                )}
                <IconButton size="small" onClick={() => handleRemoveTempAttachment(index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTempAttachments([])
            setFileDialogOpen(false)
            }} color="primary">
            닫기
          </Button>
          <Button onClick={handleSaveAttachments} color="primary">
              저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

ProjectPostForm.propTypes = {
  initialData: PropTypes.shape({
    direction: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      type: PropTypes.string,
      name: PropTypes.string,
      url: PropTypes.string
    }))
  }),
  isEdit: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  directionOptions: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(Direction))
  )
};

export default ProjectPostForm;

