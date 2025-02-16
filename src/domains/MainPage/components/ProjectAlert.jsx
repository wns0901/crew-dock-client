import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

const ProjectAlertModal = ({ open, handleClose, onCreateProject }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="alert-modal-title">
      <Box sx={style}>
        {/* 닫기 버튼 */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
        >
          <CloseIcon />
        </IconButton>

        {/* Alert 헤더 */}
        <Box sx={alertHeader}>
          <ErrorOutlineIcon sx={{ color: "red", fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "red" }}>
            생성된 프로젝트가 없습니다.
          </Typography>
        </Box>

        {/* Alert 내용 */}
        <Typography sx={{ mt: 1, mb: 2, color: "#555" }}>
          모집글을 작성하려면 프로젝트를 먼저 작성해주세요.
        </Typography>

        {/* 프로젝트 생성 버튼 */}
        <Button
          variant="contained"
          color="error"
          onClick={onCreateProject}
          fullWidth
          sx={{ borderRadius: "5px" }}
        >
          프로젝트 생성
        </Button>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "#ffebeb", // 배경색 연한 빨간색 느낌
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
  border: "1px solid red", // 빨간 테두리 추가
  textAlign: "center",
};

const alertHeader = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1,
};

export default ProjectAlertModal;
