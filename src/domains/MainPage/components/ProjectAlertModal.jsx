import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const ProjectAlertModal = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate("/mypage/projects"); // 프로젝트 생성 페이지로 이동
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="alert-modal-title">
      <Box sx={alertStyle}>
        {/* 닫기 버튼 (오른쪽 상단) */}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#7d1d1d", // 더 어두운 빨간색
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 경고 아이콘과 제목 */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ErrorOutlineIcon sx={{ color: "#7d1d1d", mr: 1, fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7d1d1d" }}>
            생성된 프로젝트가 없습니다.
          </Typography>
        </Box>

        {/* 설명 문구 */}
        <Typography sx={{ mb: 2, color: "#cc1616", fontSize: 15 }}>
          모집글을 작성하려면 프로젝트를 먼저 생성해주세요.
        </Typography>

        {/* 버튼 영역 */}
        <Button
          variant="contained"
          sx={{
            width: "100%",
            bgcolor: "#cc1616", // 더 어두운 빨간색
            "&:hover": { bgcolor: "#931919" }, // hover 시 더 어두운 색
          }}
          onClick={handleCreateProject}
        >
          프로젝트 생성
        </Button>
      </Box>
    </Modal>
  );
};

const alertStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 440, // 더 넓게 조정
  bgcolor: "#fce8e8", // 연한 빨간색 배경
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  border: "2px solid #cc1616", // 테두리 더 진한 빨간색
  textAlign: "center",
};

export default ProjectAlertModal;
