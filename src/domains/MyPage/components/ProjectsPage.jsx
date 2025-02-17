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
    const { userInfo, isLogin } = useContext(LoginContext);
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
        console.log("🔴🔴🔴🔴🔴🔴🔴🔴useEffect 실행됨됨")
        
        if (!isLogin) {
            console.warn("🔴 로그인 정보가 없음, 로그인 체크 중...");
            alert("로그인이 필요한 페이지입니다.");
            navigate("/login");
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
                if (!accessToken) {
                    console.warn("🚨 토큰 없음, 프로젝트 조회 불가");
                    return []; // ✅ 빈 배열 반환
                }
        
                const response = await fetch(`${API_BASE_URL}/projects/members`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) {
                    console.error("🚨 프로젝트 불러오기 실패 (status:", response.status, ")");
                    return []; // ✅ 빈 배열 반환
                }
        
                const data = await response.json();
        
                // ✅ API 응답이 배열인지 확인
                if (!Array.isArray(data)) {
                    console.error("🚨 프로젝트 응답이 배열이 아님!", data);
                    return []; // ✅ 배열이 아닐 경우 빈 배열 반환
                }
        
                console.log("📌 받아온 프로젝트 데이터:", data);
        
                const sortedProjects = data.sort((a, b) => {
                    const statusOrder = { BOARDING: 1, CRUISING: 2, COMPLETED: 3, SINKING: 4 };
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                    }
                    return new Date(b.startDate) - new Date(a.startDate);
                });
        
                setProjects(sortedProjects);
                return sortedProjects; // ✅ 데이터 반환 추가
            } catch (error) {
                console.error("🚨 프로젝트 가져오기 실패:", error);
                return []; // ✅ 오류 발생 시 빈 배열 반환
            }
        };
        

        const fetchIssues = async (projectsData) => {
            if (!Array.isArray(projectsData) || projectsData.length === 0) {
                console.warn("⚠️ 프로젝트 데이터가 없어서 이슈 조회를 건너뜀.");
                return;
            }
        
            console.log("📡 fetchIssues 실행 시작! projectsData:", projectsData);
        
            try {
                const accessToken = Cookies.get("accessToken");
                if (!accessToken) {
                    console.error("🚨 인증 토큰 없음!");
                    return;
                }
        
                console.log("✅ 인증 토큰 확인됨, 이슈 가져오기 시작");
        
                const issuePromises = projectsData.map(async (project) => {
                    console.log(`📡 프로젝트 ${project.id}의 이슈 가져오기 시작`);
        
                    try {
                        const response = await fetch(`${API_BASE_URL}/projects/${project.id}/issues`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                                "Content-Type": "application/json"
                            }
                        });
        
                        if (!response.ok) {
                            console.error(`🚨 프로젝트 ${project.id}의 이슈 API 호출 실패 (status: ${response.status})`);
                            return { projectId: project.id, unresolvedIssues: [] };
                        }
        
                        const data = await response.json();
        
                        if (!Array.isArray(data)) {
                            console.error(`❌ 프로젝트 ${project.id}의 응답 데이터가 배열이 아님!`, data);
                            return { projectId: project.id, unresolvedIssues: [] };
                        }
        
                        const unresolvedIssues = data.filter(issue => 
                            (issue.status === "INPROGRESS" || issue.status === "YET") && issue.managerId === userInfo.id
                        );
        
                        console.log(`🚀 프로젝트 ${project.id}의 미해결 이슈:`, unresolvedIssues);
                        
                        return { projectId: project.id, unresolvedIssues };
                    } catch (error) {
                        console.error(`❌ 프로젝트 ${project.id} 이슈 가져오기 실패:`, error);
                        return { projectId: project.id, unresolvedIssues: [] };
                    }
                });
        
                const issuesData = await Promise.all(issuePromises);
                console.log("📌 모든 프로젝트의 이슈 데이터:", issuesData);
        
                if (!issuesData || !Array.isArray(issuesData)) {
                    console.error("🚨 `issuesData`가 배열이 아님. 초기화함.");
                    setIssues({});
                    return;
                }
        
                const issuesMap = issuesData.reduce((acc, { projectId, unresolvedIssues }) => {
                    acc[projectId] = unresolvedIssues.length || 0;
                    return acc;
                }, {});
        
                console.log("✅ 최종 변환된 이슈 맵:", issuesMap);
                setIssues(issuesMap);
            } catch (error) {
                console.error("🚨 이슈 가져오기 실패:", error);
            }
        };
        
        
        const fetchData = async () => {
            setLoading(true);
            await fetchUserData();
        
            const projectsData = await fetchProjects(); // ✅ 데이터를 반환하도록 수정
            console.log("🔍 fetchProjects 반환 데이터:", projectsData);
        
            if (Array.isArray(projectsData) && projectsData.length > 0) {
                await fetchIssues(projectsData); // ✅ undefined 방지
            } else {
                console.warn("⚠️ 프로젝트 데이터가 없어서 fetchIssues() 실행 안 함!");
            }
        
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
    
            console.log("📌 선택한 스택 (객체 리스트):", newProject.stacks);
    
            // ✅ ID만 추출해서 변환
            const stackIds = newProject.stacks.map(stack => stack.id);
    
            console.log("📌 변환된 스택 ID 리스트:", stackIds);
    
            const requestData = {
                name: newProject.name || "",
                startDate: newProject.startDate,
                period: parseInt(newProject.period, 10) || 3,
                stacks: stackIds,  // ✅ ID 리스트만 전송
                position: newProject.position || "FRONT"
            };
    
            console.log("[DEBUG] 요청 데이터:", JSON.stringify(requestData, null, 2));
    
            const response = await fetch(`${API_BASE_URL}/projects/${userInfo.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
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
            <Box sx={{display: "flex", 
        minHeight: "100vh",  // ✅ 최소 높이 100vh (컨텐츠가 짧아도 사이드바 유지)
        backgroundColor: "#f9f9f9",
        alignItems: "stretch",
        borderRight: "1px solid #ccc" }}>
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
                                <Card sx={{ cursor: "pointer", p: 2, "&:hover": { boxShadow: 3 }, backgroundColor: "#f0f0f0" }} onClick={() => navigate(`/projects/${project.id}`)}>
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
