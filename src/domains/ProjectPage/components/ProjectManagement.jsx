import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ProjectMembers from "./ProjectMembers";
import Resignations from "./Resignations";

const ProjectManagement = () => {
  const { projectId } = useParams();

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>프로젝트 관리</Typography>

      {/* 프로젝트 멤버 목록 */}
      <ProjectMembers />

      {/* 탈퇴 신청 목록 */}
      <Box mt={5}>
        <Resignations />
      </Box>
    </Box>
  );
};

export default ProjectManagement;
