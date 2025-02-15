import React, { useState, useEffect } from "react";
import { Button, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../../apis/baseApi";

const RecruitmentAttachmentUpload = ({ recruitmentId, content, setContent }) => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 기존 첨부파일 불러오기
  useEffect(() => {
    if (!recruitmentId) return;

    api.get(`/recruitments/${recruitmentId}/attachments`)
      .then((res) => setUploadedFiles(res.data))
      .catch((err) => console.error("파일 조회 실패:", err));
  }, [recruitmentId]);

  // 파일 선택
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // 파일 업로드
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]); // 단일 파일 업로드

    try {
      const response = await api.post(
        `/recruitments/${recruitmentId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedFile = response.data;
      setUploadedFiles([...uploadedFiles, uploadedFile]);
      setFiles([]);

      // 🔹 Markdown에 자동으로 파일 URL 추가
      const fileUrl = uploadedFile.url;
      const fileName = fileUrl.split("/").pop(); // 파일명 추출
      const fileMarkdown = fileUrl.match(/\.(jpeg|jpg|gif|png)$/) 
        ? `![${fileName}](${fileUrl})`  // 이미지 파일이면 ![이미지]
        : `[${fileName}](${fileUrl})`; // 일반 파일이면 [파일]

      setContent((prevContent) => prevContent + `\n${fileMarkdown}\n`); // Markdown에 추가
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  // 파일 삭제
  const handleDelete = async (attachmentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/recruitments/${recruitmentId}/attachments/${attachmentId}`);
      setUploadedFiles(uploadedFiles.filter((file) => file.id !== attachmentId));
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mt: 2 }}>첨부파일</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ ml: 2 }}>
        업로드
      </Button>

      <List>
        {uploadedFiles.map((file) => (
          <ListItem key={file.id} secondaryAction={
            <IconButton edge="end" onClick={() => handleDelete(file.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={<a href={file.url} target="_blank" rel="noopener noreferrer">{file.url.split("/").pop()}</a>} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default RecruitmentAttachmentUpload;
