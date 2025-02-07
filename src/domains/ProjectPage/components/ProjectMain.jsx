import React from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import ProjectInfo from "./ProjectInfo";
import SettingsSidebar from "./SettingsSidebar";

const ProjectMain = () => {
    const location = useLocation();
    const isSettingsMode = location.pathname.includes("settings")
    || location.pathname.includes("members")
    || location.pathname.includes("manage")
    || location.pathname.includes("pending")
    ;

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* 좌측 사이드바 (고정) */}
            <Box
                sx={{
                    width: "250px",
                    backgroundColor: "#f4f4f4",
                    padding: "16px",
                    borderRight: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* 설정 페이지에서는 SettingsSidebar, 다른 페이지에서는 ProjectInfo */}
                {isSettingsMode ? <SettingsSidebar /> : <ProjectInfo />}
            </Box>

            {/* 우측 컨텐츠 영역 */}
            <Box sx={{ flexGrow: 1, padding: "16px", overflowY: "auto" }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default ProjectMain;
