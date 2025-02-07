import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ProjectMembers from "./ProjectMembers";
import Resignations from "./Resignations";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const ProjectManagement = () => {
  const { projectId } = useParams();
  const { projectRoles } = useContext(LoginContext);

  // 현재 로그인한 사용자가 CAPTAIN인지 확인
  const isCaptain = projectRoles.some(
    (role) => Number(role.projectId) === Number(projectId) && role.role.isCaptain
  );
  console.log("projectRoles:", projectRoles);
console.log("current projectId:", projectId);
console.log(
  "isCaptain:",
  projectRoles.some(
    (role) => role.projectId === parseInt(projectId) && role.role === "CAPTAIN"
  )
);


  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>프로젝트 관리</Typography>

      {/* 프로젝트 멤버 목록 */}
      <ProjectMembers />

      {/* CAPTAIN만 탈퇴 신청 목록을 볼 수 있도록 조건 추가 */}
      {isCaptain && (
        <Box mt={5}>
          <Resignations />
        </Box>
      )}
    </Box>
  );
};

export default ProjectManagement;
