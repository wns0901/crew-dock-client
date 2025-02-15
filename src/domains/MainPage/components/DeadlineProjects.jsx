import React, { useEffect, useState, useRef } from "react";
import api from "../../../apis/baseApi";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { position, region } from "../../MainPage/components/Filter";

// 🔹 D-Day 계산 함수
const calculateDDay = (deadline) => {
  if (!deadline) return "마감일 없음";

  const targetDate = new Date(deadline + "T00:00:00");
  if (isNaN(targetDate.getTime())) return "잘못된 날짜";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day" : "마감됨";
};

const DeadlineProjects = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [scrappedPosts, setScrappedPosts] = useState({});
  const [stacks, setStacks] = useState([]);
  const [projectStacks, setProjectStacks] = useState({});

  // ✅ 모집글 데이터 가져오기 & 마감일 기준 정렬
  useEffect(() => {
    api.get("/recruitments")
      .then(response => {
        const filteredProjects = response.data.content.filter((project) => {
          const dDay = calculateDDay(project.deadline);
          return dDay.startsWith("D-") && parseInt(dDay.split("-")[1]) <= 3;
        });

        const sortedProjects = filteredProjects.sort((a, b) => {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return dateA - dateB;
        });

        setProjects(sortedProjects);
      })
      .catch(error => console.error("❌ 데이터 가져오기 실패:", error));
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      if (!projectStacks[project.projectId]) {
        console.log("프로젝트 ID:", project.projectId); // ✅ 프로젝트 ID 확인
        api.get(`/projects/${project.projectId}/stacks`)
          .then((response) => {
            console.log(`프로젝트 ${project.projectId}의 스택 데이터:`, response.data); // ✅ API 응답 확인
            setProjectStacks((prev) => ({
              ...prev,
              [project.projectId]: response.data.map(stack => stack.stackName) // ✅ 필요한 정보만 저장
            }));
          })
          .catch((error) => console.error(`프로젝트 ${project.projectId} 스택 가져오기 실패:`, error));
      }
    });
  }, [projects]);

  const goToDetail = (id) => {
    navigate(`/recruitments/${id}`);
  };

  const handleScrap = async (id) => {
    try {
      if (scrappedPosts[id]) {
        await api.delete(`/recruitments/${id}/scrap`);
        setScrappedPosts((prev) => ({ ...prev, [id]: false }));
      } else {
        await api.post(`/recruitments/${id}/scrap`);
        setScrappedPosts((prev) => ({ ...prev, [id]: true }));
      }
    } catch (error) {
      console.error("❌ 스크랩 실패:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
        곧 모집 마감인 프로젝트
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => scrollRef.current.scrollLeft -= 400}>
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: 1,
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": { display: "none" },
            flexGrow: 1,
          }}
        >
          <Grid container spacing={3} sx={{ padding: 2 }}>
            {projects.length === 0 ? (
              <Typography variant="h6">모집 중인 프로젝트가 없습니다.</Typography>
            ) : (
              projects.map((project) => (
                <Grid item xs={12} sm={6} md={3} key={project.id}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      borderRadius: "12px",
                      padding: 1,
                      boxShadow: 3,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onClick={() => goToDetail(project.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
                        <Typography variant="caption">마감일: {project.deadline || "미정"}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip label={calculateDDay(project.deadline)} color="error" size="small" />
                          <IconButton onClick={() => handleScrap(project.id)}>
                            {scrappedPosts[project.id] ? (
                              <BookmarkIcon sx={{ color: "gray" }} />
                            ) : (
                              <BookmarkBorderIcon sx={{ color: "gray" }} />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        [{project.title}]
                      </Typography>

                      {/* ✅ 기술 스택 표시 */}
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 1 }}>
                        {projectStacks[project.projectId]?.length > 0
                          ? projectStacks[project.projectId].map((stack, idx) => <Chip key={idx} label={`#${stack}`} size="small" variant="outlined" />)
                          : <Typography variant="body2">기술 스택 없음</Typography>}
                      </Box>

                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", marginBottom: 1 }}>
                        {project.recruitedField
                          ? project.recruitedField.split(",").map((field) => {
                              const trimmedField = field.trim();
                              console.log("🧐 찾는 모집 분야 값:", trimmedField); // 🔹 디버깅 로그

                              // `position` 배열이 정상적으로 존재하는지 확인
                              if (!position || !Array.isArray(position)) {
                                console.error("❌ position 데이터가 없습니다.");
                                return trimmedField;
                              }

                              // 해당 value를 가진 항목 찾기
                              const found = position.find((p) => p.value === trimmedField);
                              if (!found) {
                                console.warn(`⚠️ '${trimmedField}'에 해당하는 label을 찾을 수 없음`);
                              }
                              return found ? found.label : trimmedField;
                            }).join(", ")
                          : "알 수 없음"}
                      </Typography>

                      <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 1 }}>
                        <Typography variant="body2">모집 인원: {project.recruitedNumber}/3</Typography>
                        <Typography variant="body2">
                          지역: {region.find((r) => r.value === project.region)?.label || "알 수 없음"}
                        </Typography>
                      </Box>
                      

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {project.user?.nickName || "익명"}
                        </Typography>
                        <Typography variant="body2">댓글 수: 3</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        <IconButton onClick={() => scrollRef.current.scrollLeft += 400}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DeadlineProjects;
