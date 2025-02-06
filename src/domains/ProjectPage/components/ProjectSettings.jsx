import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const ProjectSettings = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
            {/* 상단 버튼 */}
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate(`/projects/${projectId}`)}
                sx={{ marginBottom: 2 }}
            >
                프로젝트로 돌아가기
            </Button>

            {/* 설정 및 관리 컨텐츠 */}
            <Typography variant="h4" gutterBottom>
                설정 및 관리
            </Typography>
            <Typography variant="body1">
                프로젝트 관련 설정을 관리하는 페이지입니다.
            </Typography>

            {/* 하단 버튼 */}
            <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate(`/projects/${projectId}/access-requests`)}
                sx={{ marginTop: 4 }}
            >
                세부사항 엑세스 신청명단
            </Button>
        </Box>
    );
};

export default ProjectSettings;
