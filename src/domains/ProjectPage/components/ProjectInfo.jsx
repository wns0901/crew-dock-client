import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import AnchorIcon from "@mui/icons-material/Anchor"

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProjectInfo = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [navValue, setNavValue] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${BASE_URL}/projects/${projectId}`);
                if (!response.ok) throw new Error("프로젝트 정보를 가져오는데 실패했습니다.");
                const data = await response.json();
                setProject(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!project) {
        return null;
    }

    const addMonths = (dateStr, months) => {
        const date = new Date(dateStr);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split("T")[0]; 
    };

    const formattedEndDate = project.startDate
        ? addMonths(project.startDate, project.period)
        : "";

        const statusMapping = {
            BOARDING: "승선중",
            CRUISING: "순항중",
            COMPLETED: "항해완료",
            SINKING: "난파",
        };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* 프로젝트 정보 */}
            <Box sx={{ flex: 1, padding: 2, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* 프로젝트 이미지 */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <img
                        src={project.imgUrl}
                        alt="프로젝트 이미지"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #ddd",
                        }}
                    />
                </Box>
               
                <Typography variant="h5" component="div" gutterBottom>
                <AnchorIcon sx={{ fontSize: 25, color: "red", }} /> {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>기간:</strong> {project.startDate} ~ {formattedEndDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
    <strong>상태:</strong> {statusMapping[project.status] || "알 수 없음"}
</Typography>

<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, maxWidth: "300px", overflow: "hidden" }}>
    {project.stacks.slice(0, 5).map((stackItem) => (
        <Box 
            key={stackItem.id} 
            sx={{ 
                backgroundColor: "#70a7ff", 
                color: "#ffffff", 
                px: 1.5, 
                py: 0.5, 
                borderRadius: "8px", 
                fontSize: "14px" 
            }}
        >
            {stackItem.stack.name}
        </Box>
    ))}
    {project.stacks.length > 5 && (
        <Typography variant="body2" color="text.secondary">
            +{project.stacks.length - 5} more
        </Typography>
    )}
</Box>

                {/* URL 아이콘 버튼 */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                    {project.githubUrl1 && (
                        <IconButton onClick={() => window.open(project.githubUrl1, "_blank")}>
                            <GitHubIcon fontSize="large" />
                        </IconButton>
                    )}
                    {project.githubUrl2 && (
                        <IconButton onClick={() => window.open(project.githubUrl2, "_blank")}>
                            <GitHubIcon fontSize="large" />
                        </IconButton>
                    )}
                    {project.designUrl && (
                        <IconButton onClick={() => window.open(project.designUrl, "_blank")}>
                            <DesignServicesIcon fontSize="large" />
                        </IconButton>
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                    <strong>소개:</strong> {project.introduction}
                </Typography>

                {/* 네비게이션 바 */}
                <BottomNavigation
                    sx={{
                        backgroundColor: "#f4f4f4",
                        borderTop: "1px solid #ccc",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: 2,
                    }}
                    showLabels
                    value={navValue}
                    onChange={(event, newValue) => {
                        setNavValue(newValue);
                        if (newValue === 0) navigate(`/projects/${projectId}/issues`);
                        if (newValue === 1) navigate(`/projects/${projectId}/Git`);
                        if (newValue === 2) navigate(`/projects/${projectId}/posts`);
                        if (newValue === 3) navigate(`/projects/${projectId}/settings`);
                    }}
                >
                    <BottomNavigationAction label="이슈 관리" />
                    <BottomNavigationAction label="커밋 관리" />
                    <BottomNavigationAction label="게시판" />
                    <BottomNavigationAction label="설정 및 관리" />
                </BottomNavigation>
            </Box>
        </Box>
    );
};

export default ProjectInfo;
