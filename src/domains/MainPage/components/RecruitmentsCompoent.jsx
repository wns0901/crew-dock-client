import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 상세 페이지 이동
import api from "../../../apis/baseApi";
import {
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Pagination,
  Box,
  Chip,
  IconButton
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";  // 빈 북마크
import BookmarkIcon from "@mui/icons-material/Bookmark";  // 채워진 북마크
import { position, proceedMethod, region } from "../components/Filter"; // 필터 유지

const RecruitmentsComponent = () => {
  const navigate = useNavigate(); // 네비게이션 함수
  const [filters, setFilters] = useState({
    stack: "",
    position: "",
    progress: "",
    region: "",
  });
  const [projects, setProjects] = useState([]);
  const [projectStacks, setProjectStacks] = useState({}); // ✅ 프로젝트별 기술 스택 상태 추가
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stacks, setStacks] = useState([]);
  const [scrappedPosts, setScrappedPosts] = useState({}); // 스크랩 상태 관리
  
  // ✅ 모집글 데이터 가져오기 (필터링 반영)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.stack) params.append("stack", filters.stack);
    if (filters.position) params.append("position", filters.position);
    if (filters.progress) params.append("proceedMethod", filters.progress);
    if (filters.region) params.append("region", filters.region);
    params.append("page", page);

    console.log("필터링 요청 URL:", `/recruitments/filter?${params.toString()}`); // 디버깅

    api
      .get(`/recruitments/filter?${params.toString()}`)
      .then((response) => {
        console.log("백엔드 응답 데이터:", response.data);
        setProjects(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("데이터 가져오기 실패:", error));
  }, [filters, page]);

  // ✅ 프로젝트별 기술 스택 가져오기
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

    // D-Day 계산 함수
    const calculateDDay = (deadline) => {
      if (!deadline) return "마감일 없음";
      const targetDate = new Date(deadline + "T00:00:00"); // 음 
      if (isNaN(targetDate.getTime())) return "잘못된 날짜"; // 유효성 체크
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day" : "마감됨";
    };
    const handleScrap = async (id) => {  // ✅ async 추가
      const userId = localStorage.getItem("userId"); 
      if (!userId) {
        alert("로그인이 필요합니다.");
        return;
      }
    
      try {
        if (scrappedPosts[id]) {
          await api.delete(`/recruitments/${id}/scrap`);  // ✅ await 사용 가능
          setScrappedPosts((prev) => ({ ...prev, [id]: false }));
        } else {
          await api.post(`/recruitments/${id}/scrap`);  // ✅ await 사용 가능
          setScrappedPosts((prev) => ({ ...prev, [id]: true }));
        }
      } catch (error) {
        console.error("스크랩 실패:", error);
      }
    };

  return (
    <div>
      <Typography variant="h6" sx={{ display: "flex", marginBottom: 2, marginLeft: 2}}>
              전체 프로젝트 모집글
            </Typography>

      {/* 필터 UI 유지 */}
      {/* 필터 UI 복구 */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 2, marginLeft: 2 }}>
        <TextField select label="기술 스택" value={filters.stack} onChange={(e) => setFilters((prev) => ({ ...prev, stack: e.target.value }))} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {stacks.map((stack) => (
            <MenuItem key={stack.id} value={stack.name}>{stack.name}</MenuItem>
          ))}
        </TextField>

        <TextField select label="모집 분야" value={filters.position} onChange={(e) => setFilters((prev) => ({ ...prev, position: e.target.value }))} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {position.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>

        <TextField select label="진행 방식" value={filters.progress} onChange={(e) => setFilters((prev) => ({ ...prev, progress: e.target.value }))} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {proceedMethod.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>

        <TextField select label="지역" value={filters.region} onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {region.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* 프로젝트 리스트 */}
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {projects.length === 0 ? (
          <Typography variant="h6">모집 중인 프로젝트가 없습니다.</Typography>
        ) : (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <Card sx={{ maxWidth: 345, borderRadius: "12px", padding: 1, boxShadow: 3, textAlign: "left", cursor: "pointer" }} onClick={() => goToDetail(project.id)}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
                    <Typography variant="caption">마감일: {project.deadline || "미정"}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip label={calculateDDay(project.deadline)} color="error" size="small" />
                      <IconButton onClick={() => handleScrap(project.id)}>
                    {scrappedPosts[project.id] ? (
                      <BookmarkIcon sx={{ color: "gray" }} />  // 스크랩됨
                    ) : (
                      <BookmarkBorderIcon sx={{ color: "gray" }} />  // 스크랩 안됨
                    )}
                    </IconButton>
                    </Box>
                    </Box>
                    
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    [{project.title}]
                  </Typography>

                  {/* 기술 스택 표시 */}
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 1 }}>
                    {projectStacks[project.projectId]?.length > 0
                      ? projectStacks[project.projectId].map((stack, idx) => <Chip key={idx} label={`#${stack}`} size="small" variant="outlined" />)
                      : <Typography variant="body2">기술 스택 없음</Typography>}
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", marginBottom: 1 }}>
                    {project.recruitedField
                      ? project.recruitedField.split(",").map((field) => {
                          const trimmedField = field.trim();
                          const found = position.find((p) => p.value === trimmedField);
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
                    <Typography variant="body2">댓글 수</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
        {/* 페이지네이션 */}
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(event, value) => setPage(value)}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          />
  </div>
  );
};

export default RecruitmentsComponent;
