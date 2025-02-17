import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

const CommentForm = ({ onSubmit, initialValue = "", parentCommentId }) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, parentCommentId);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          size="small"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <Button type="submit" variant="contained">
          작성
        </Button>
      </Stack>
    </form>
  );
};

export default CommentForm;