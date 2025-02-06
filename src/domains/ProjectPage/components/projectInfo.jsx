import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  // ✅ useNavigate 추가
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

const API_BASE_URL = "http://localhost:8080/projects";

const ProjectInfo = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();  // ✅ useNavigate 훅 사용
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [navValue, setNavValue] = useState(0);

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

    const addMonths = (dateStr, months) => {
        const date = new Date(dateStr);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식으로 변환
    };
    
    const formattedEndDate = project.startDate
        ? addMonths(project.startDate, project.period)
        : "";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* 프로젝트 정보 카드 */}
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                    overflowY: "auto",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column", 
                }}
            >
             
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
                            {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>기간:</strong> {project.startDate} ~ {formattedEndDate}
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
                            <strong>소개:</strong> {project.introduction}
                        </Typography>
              

                {/* 세로 네비게이션 바 */}
                <BottomNavigation
                    sx={{
                        backgroundColor: "#f4f4f4",
                        borderTop: "1px solid #ccc",
                        display: "flex",
                        flexDirection: "column", // 세로로 배치
                        alignItems: "center", // 가운데 정렬
                        paddingTop: 2,
                    }}
                    showLabels
                    value={navValue}
                    onChange={(event, newValue) => {
                        setNavValue(newValue);
                        if (newValue === 0) navigate(`/projects/${projectId}`);
                        if (newValue === 1) navigate(`/projects/${projectId}/members`);
                        if (newValue === 2) navigate(`/projects/${projectId}/resignations`);
                        if (newValue === 3) navigate(`/projects/${projectId}/settings`);
                    }}
                >
                    <BottomNavigationAction label="커밋 기록" />
                    <BottomNavigationAction label="멤버 관리" />
                    <BottomNavigationAction label="탈퇴 신청 목록" />
                    <BottomNavigationAction label="설정 및 관리" />
                </BottomNavigation>
            </Box>
        </Box>
    );
};

export default ProjectInfo;
