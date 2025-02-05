import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";

const API_BASE_URL = "http://localhost:8080/projects";

const ProjectInfo = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${projectId}`);
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

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
       
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                    overflowY: "auto",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Card sx={{ maxWidth: 800, width: "100%" }}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>기간:</strong> {project.period}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>시작일:</strong> {project.startDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>상태:</strong> {project.status}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>URL1:</strong> {project.githubUrl1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>URL2:</strong> {project.githubUrl2}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>디자인:</strong> {project.designUrl}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>이미지:</strong> {project.imgUrl}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>소개:</strong> {project.introduction}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ProjectInfo;
