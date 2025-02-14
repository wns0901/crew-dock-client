import React, { useEffect, useState, useContext } from "react";
import {
    Box, Typography, CircularProgress, Grid, Card, CardContent, Button, Chip
} from "@mui/material";
import MypageSidebar from "./MypageSidebar"; 
import ProjectsModal from "./ProjectsModal";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../apis/baseApi";

const API_BASE_URL = api.defaults.baseURL; 

const ProjectsPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const { userInfo } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [projects, setProjects] = useState([]);
    const [issues, setIssues] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newProject, setNewProject] = useState({
        name: "",
        startDate: dayjs().format("YYYY-MM-DD"),
        period: "3", 
        stacks: [],
        position: userInfo?.hopePosition || "" // ✅ hopePosition 자동 설정
    });

    
    const userId = paramUserId && !isNaN(paramUserId) ? Number(paramUserId) : userInfo?.id ?? null;
    

    useEffect(() => {
        if (!userInfo || !userInfo.id) {
            console.warn("🔴 로그인 정보가 없음, 로그인 체크 중...");
            return;
        }

        if (!userId) {
            console.warn("🔴 유저 ID를 가져올 수 없음, 로그인 페이지로 이동");
            navigate("/login");
            return;
        }

        if (userInfo.id !== userId) {
            console.warn("👀 다른 사용자의 마이페이지로 접근 중, 포트폴리오로 이동");
            navigate(`/mypage/${userId}/portfolios`);
            return;
        }



        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/user/${userInfo.id}`);
                if (!response.ok) throw new Error("유저 정보 불러오기 실패");
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("🚨 유저 정보 가져오기 실패:", error);
            }
        };

        const fetchProjects = async () => {
            try {
                const accessToken = Cookies.get("accessToken");
                if (!accessToken) return;

                const response = await fetch(`${API_BASE_URL}/projects/members`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("프로젝트 불러오기 실패");

                const data = await response.json();
                
                const sortedProjects = data.sort((a, b) => {
                    const statusOrder = { BOARDING: 1, CRUISING: 2, COMPLETED: 3, SINKING: 4 };
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                    }
                    return new Date(b.startDate) - new Date(a.startDate);
                });
                
                setProjects(sortedProjects);
            } catch (error) {
                console.error("🚨 프로젝트 가져오기 실패:", error);
            }
        };

        const fetchIssues = async (projectsData) => {
            try {
                const accessToken = Cookies.get("accessToken");
                if (!accessToken) return;

                const issuePromises = projectsData.map(async (project) => {
                    const response = await fetch(`${API_BASE_URL}/projects/${project.id}/issues`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });
                    
                    if (!response.ok) throw new Error(`이슈 불러오기 실패 (프로젝트 ID: ${project.id})`);
                    const data = await response.json();
                    
                    const unresolvedIssues = data.filter(issue => 
                        (issue.status === "INPROGRESS" || issue.status === "YET") && issue.managerId === userInfo.id
                    );
                    
                    return { projectId: project.id, unresolvedIssues };
                });

                const issuesData = await Promise.all(issuePromises);
                const issuesMap = issuesData.reduce((acc, { projectId, unresolvedIssues }) => {
                    acc[projectId] = unresolvedIssues.length;
                    return acc;
                }, {});
                setIssues(issuesMap);
            } catch (error) {
                console.error("🚨 이슈 가져오기 실패:", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchUserData(), fetchProjects(), fetchIssues()]);
            setLoading(false);
        };

        fetchData();
    }, [userId, userInfo,navigate]);

    // ✅ 프로젝트 상태 변환 (영어 -> 한글)
    const getStatusLabel = (status) => {
        switch (status) {
            case "BOARDING": return "🚢 승선중";
            case "CRUISING": return "⛵ 순항중";
            case "COMPLETED": return "🏁 항해완료";
            case "SINKING": return "⚠️ 난파";
            default: return "알 수 없음";
        }
    };

    // ✅ 프로젝트 상태에 따른 색상
    const getStatusColor = (status) => {
        switch (status) {
            case "BOARDING": return "#007BFF"; // 승선중 (파랑)
            case "CRUISING": return "#28A745"; // 순항중 (초록)
            case "COMPLETED": return "#FFC107"; // 항해완료 (노랑)
            case "SINKING": return "#DC3545"; // 난파 (빨강)
            default: return "gray";
        }
    };

    const handleOpenModal = () => {
        setNewProject((prev) => ({
            ...prev,
            position: userInfo.hopePosition || "", 
        }));
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCreateProject = async (newProject) => {
        try {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                console.error("🚨 인증 토큰이 없음! (로그인 필요)");
                return;
            }
    
            // ✅ 백엔드에서 기대하는 JSON 형식으로 변환
            const requestData = {
                name: newProject.name || "", // 프로젝트명
                startDate: newProject.startDate, // 시작 날짜 (YYYY-MM-DD)
                period: parseInt(newProject.period, 10) || 3, // 숫자로 변환
                stacks: newProject.stacks ? newProject.stacks.map(stack => Number(stack.id)) : [], // 스택 ID 숫자로 변환
                position: newProject.position || "FRONT" // 기본값 설정
            };
    
            console.log("[DEBUG] 요청 데이터:", JSON.stringify(requestData, null, 2)); // 🔥 디버깅용 콘솔 출력
    
            const response = await fetch(`${API_BASE_URL}/projects/${userInfo.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData) // ✅ JSON 변환 후 전송
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("🚨 프로젝트 생성 실패:", errorResponse);
                throw new Error("프로젝트 생성 실패");
            }
    
            const createdProject = await response.json();
            setProjects([...projects, createdProject]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("🚨 프로젝트 생성 실패:", error);
        }
    };
    
    

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box sx={{ width: "250px", flexShrink: 0 }}>
                <MypageSidebar user={user} />
            </Box>

            <Box sx={{ flexGrow: 1, padding: "40px" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button variant="contained" sx={{ mb: 3 }} onClick={handleOpenModal}>프로젝트 추가하기</Button>
                </Box>

                {projects.length === 0 ? (
                    <Typography>참여한 프로젝트가 없습니다.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {projects.map((project, index) => (
                            <Grid item xs={12} key={index}>
                                <Card sx={{ cursor: "pointer", p: 2, "&:hover": { boxShadow: 3 }, backgroundColor: "#f0f0f0" }} onClick={() => navigate(`/project/${project.id}`)}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.5rem" }}>[{project.name}］</Typography>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                            <Typography sx={{ mt: 1 }}>나의 미해결 이슈: <strong>{issues[project.id] || 0}</strong></Typography>
                                            <Chip
                                                label={getStatusLabel(project.status)}
                                                sx={{ 
                                                    backgroundColor: getStatusColor(project.status),
                                                    color: "white",
                                                    fontSize: "1.3rem",
                                                    padding: "15px 25px",
                                                    fontWeight: "bold"
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* 🔥 프로젝트 추가 모달 연결 */}
            <ProjectsModal 
                open={isModalOpen} 
                handleClose={handleCloseModal} 
                handleCreateProject={handleCreateProject} 
                newProject={newProject} 
                setNewProject={setNewProject} // ✅ 상태 업데이트 가능하게 넘겨줌
            />
        </Box>
    );
};

export default ProjectsPage;
