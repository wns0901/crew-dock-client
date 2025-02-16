import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProjectSelectModal = ({ open, handleClose, projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const handleProjectSelect = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleCreateProject = () => {
    navigate("/mypage/projects"); // 새 프로젝트 생성 페이지로 이동
  };

  const handleWrite = () => {
    if (selectedProject) {
      navigate(`/recruitment/write?projectId=${selectedProject}`); // 선택한 프로젝트의 모집글 작성 페이지로 이동
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="project-modal-title">
      <Box sx={style}>
        <Typography id="project-modal-title" variant="h6" sx={{ fontWeight: "bold" }}>
          프로젝트 선택하기
        </Typography>
        
        {/* 프로젝트 선택 라디오 버튼 */}
        <RadioGroup value={selectedProject} onChange={handleProjectSelect} sx={{ mt: 2 }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <FormControlLabel
                key={project.id}
                value={project.id}
                control={<Radio />}
                label={project.name}
              />
            ))
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>
              캡틴 권한이 있는 프로젝트가 없습니다.
            </Typography>
          )}
        </RadioGroup>

        {/* 버튼 그룹 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleCreateProject}>
            새 프로젝트 생성하기
          </Button>
          <Button variant="contained" color="success" onClick={handleWrite} disabled={!selectedProject}>
            작성하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

export default ProjectSelectModal;
