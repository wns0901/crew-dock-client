import React from 'react';
import ProjectMembers from './ProjectMembers';
import ProjectInfo from './ProjectInfo';
import GitData from './GitData';
import Resignations from './Resignations';
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const ProjectMain = () => {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
      {/* 좌측 사이드바 */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#f4f4f4",
          padding: "16px",
          borderRight: "1px solid #ccc",
        }}
      >
        <ProjectInfo />
      </Box>

      {/* 우측 컨텐츠 영역 */}
      <Box sx={{ flexGrow: 1, padding: "16px" }}>
        <Outlet />
      </Box>
    </Box>
    );
};

export default ProjectMain;