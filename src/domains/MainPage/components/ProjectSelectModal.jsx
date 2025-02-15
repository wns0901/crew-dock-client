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
    navigate("/projects/new"); // 새 프로젝트 생성 페이지로 이동
  };

  const handleWrite = () => {
    if (selectedProject) {
      navigate(`/recruitment/write?projectId=${selectedProject}`); // 선택한 프로젝트의 모집글 작성 페이지로 이동
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="project-modal-title">
      <Box sx={style}>
        <Typography id="project-modal-title" variant="h6">
          프로젝트 선택하기
        </Typography>
        <RadioGroup value={selectedProject} onChange={handleProjectSelect}>
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
            <Typography color="error">캡틴 권한이 있는 프로젝트가 없습니다.</Typography>
          )}
        </RadioGroup>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" onClick={handleCreateProject}>
            새 프로젝트 생성하기
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleWrite}
            disabled={!selectedProject}
          >
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
