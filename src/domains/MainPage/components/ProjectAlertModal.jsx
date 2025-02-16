import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProjectAlertModal = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate("/projects/new"); // 프로젝트 생성 페이지로 이동
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="alert-modal-title">
      <Box sx={alertStyle}>
        <Typography id="alert-modal-title" variant="h6" color="error">
          생성된 프로젝트가 없습니다. Mypage url 로 이동하게 만들기
        </Typography>
        <Typography>모집글을 작성하려면 프로젝트를 먼저 생성해주세요.</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleCreateProject}>
            프로젝트 생성
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const alertStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  border: "2px solid #f44336",
};

export default ProjectAlertModal;
