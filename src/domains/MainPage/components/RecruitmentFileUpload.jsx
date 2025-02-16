import React, { useState } from "react";
import api from "../../../apis/baseApi";
import { Box, Button, Typography } from "@mui/material";

const RecruitmentFileUpload = ({ recruitmentsId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await api.post(
        `/recruitments/${recruitmentsId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("파일이 업로드되었습니다!");
      onUploadSuccess(response.data); // 부모 컴포넌트에 업로드된 데이터 전달
      setSelectedFile(null);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 실패!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">첨부파일 업로드</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button 
        onClick={handleUpload} 
        variant="contained" 
        color="primary"
        disabled={uploading}
      >
        {uploading ? "업로드 중..." : "파일 업로드"}
      </Button>
    </Box>
  );
};

export default RecruitmentFileUpload;
