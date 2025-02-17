import React, { useEffect, useState, useContext } from "react";
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
  IconButton,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // 빈 북마크
import BookmarkIcon from "@mui/icons-material/Bookmark"; // 채워진 북마크
import { position, proceedMethod, region } from "../components/Filter"; // 필터 유지
import { LoginContext } from "../../../contexts/LoginContextProvider"; // LoginContext

const RecruitmentsComponent = () => {
  const navigate = useNavigate(); // 네비게이션 함수
  const [filters, setFilters] = useState({
    stack: "",
    position: "",
    progress: "",
    region: "",
  });
  const [projects, setProjects] = useState([]);
  const [projectStacks, setProjectStacks] = useState({}); // 프로젝트별 기술 스택 상태 추가
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stacks, setStacks] = useState([]);
  const [scrappedPosts, setScrappedPosts] = useState([]); // 스크랩 상태 관리
  const { userInfo, isLogin } = useContext(LoginContext); // LoginContext에서 userInfo 가져오기
  const userId = userInfo?.id;
  // 모집글 데이터 가져오기 (필터링 반영)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.stack) params.append("stack", filters.stack);
    if (filters.position) params.append("position", filters.position);
    if (filters.progress) params.append("proceedMethod", filters.progress);
    if (filters.region) params.append("region", filters.region);
    params.append("page", page);

    console.log(
      "필터링 요청 URL:",
      `/recruitments/filter?${params.toString()}`
    ); // 디버깅

    (async () => {
      let tempPostDatas;
      await api
        .get(`/recruitments/filter?${params.toString()}`)
        .then((response) => {
          console.log("백엔드 응답 데이터:", response.data);
          tempPostDatas = response.data.content.map((post) => ({
            ...post,
            commentCnt: 5,
          }));
          setProjects(tempPostDatas);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error("데이터 가져오기 실패:", error));

      const tempProjectStacks = { ...projectStacks };

      try {
        await Promise.all(
          tempPostDatas.map(async (project) => {
            if (!tempProjectStacks[project.projectId]) {
              const response = await api.get(
                `/projects/${project.projectId}/stacks`
              );
              tempProjectStacks[project.projectId] = response.data.map(
                (stack) => stack.stackName
              );
            }
          })
        );

        setProjectStacks(tempProjectStacks);
      } catch (error) {
        console.error("프로젝트 스택 가져오기 실패:", error);
      }

      if (userId) {
        api
          .get(`/recruitments/scraps?userId=${userId}`)
          .then((response) => {
            const scrappedIds = response.data.map(
              (post) => post.recruitmentPostId
            ); // 스크랩된 게시글 ID 리스트
            setScrappedPosts(scrappedIds);
          })
          .catch((error) =>
            console.error("스크랩 게시글 가져오기 실패:", error)
          );
      }
    })();
  }, [filters, page]);

  // 스택
  useEffect(() => {
    api
      .get("/stacks/all")
      .then((response) => {
        setStacks(response.data); // 전체 스택 목록 저장
      })
      .catch((error) => console.error("기술 스택 목록 가져오기 실패:", error));
  }, []);

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

  useEffect(
    () => console.log("스크랩 상태 변경:", scrappedPosts),
    [scrappedPosts]
  );

  // 스크랩 추가/삭제
  const handleScrap = (recruitmentPostId) => {
    if (scrappedPosts.includes(recruitmentPostId)) {
      api
        .delete(`/recruitments/${recruitmentPostId}/scrap?userId=${userId}`)
        .then(() => {
          setScrappedPosts((prev) =>
            prev.filter((id) => id !== recruitmentPostId)
          );
        })
        .catch((error) => console.error("스크랩 삭제 실패:", error));
    } else {
      api
        .post(`/recruitments/${recruitmentPostId}/scrap?userId=${userId}`)
        .then(() => {
          setScrappedPosts((prev) => [...prev, recruitmentPostId]);
        })
        .catch((error) => console.error("스크랩 추가 실패:", error));
    }
  };

  return (
    <div>
      {/* 모집글 제목 */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          display: "flex",
          marginBottom: 2,
          paddingX: 30,
          textAlign: "left",
          maxWidth: "1200px",
          marginLeft: "0",
          marginTop: 20,
          justifyContent: "flex-start", // Flexbox에서 왼쪽 정렬 보장
        }}
      >
        전체 프로젝트 모집글
      </Typography>

      {/* 필터 UI 박스 */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: 2,
          paddingX: 30,
          maxWidth: "1200px",
          marginX: "0",
        }}
      >
        <TextField
          select
          label="기술 스택"
          value={filters.stack || "전체"} // 값이 없으면 "전체" 표시
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              stack: e.target.value === "전체" ? "" : e.target.value,
            }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="전체">전체</MenuItem>
          {stacks.map((stack, index) => (
            <MenuItem key={index} value={stack}>
              {stack}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="모집 분야"
          value={filters.position || "전체"} // 값이 없으면 "전체" 표시
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              position: e.target.value === "전체" ? "" : e.target.value, // "전체" 선택 시 필터 초기화
            }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="전체">전체</MenuItem> {/* "전체" 선택 가능 */}
          {position.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="진행 방식"
          value={filters.progress || "전체"} // 값이 없으면 "전체" 표시
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              progress: e.target.value === "전체" ? "" : e.target.value, // "전체" 선택 시 필터 초기화
            }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="전체">전체</MenuItem> {/* "전체" 선택 가능 */}
          {proceedMethod.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="지역"
          value={filters.region || "전체"} // 값이 없으면 "전체" 표시
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              region: e.target.value === "전체" ? "" : e.target.value, // "전체" 선택 시 필터 초기화
            }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="전체">전체</MenuItem> {/* "전체" 선택 가능 */}
          {region.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          padding: 2,
          paddingX: 26,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 2,
        }}
      >
        {projects.length === 0 ? (
          <Typography variant="h6">모집 중인 프로젝트가 없습니다.</Typography>
        ) : (
          projects.map((project) => (
            <Grid
              item
              xs={12} // 모바일 화면에서는 한 줄에 하나
              sm={6} // 태블릿에서는 한 줄에 두 개
              md={4} // 노트북 크기에서는 한 줄에 세 개
              lg={3} // 큰 화면에서는 한 줄에 네 개
              key={project.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  padding: 0.5,
                  boxShadow: 3,
                  textAlign: "left",
                  cursor: "pointer",
                  maxWidth: "320px", // 카드가 너무 커지지 않도록 제한
                  maxHeight: "320px",
                  width: "100%", // 부모 크기에 맞춰 유동적으로 조정
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  margin: 4,
                }}
                onClick={() => goToDetail(project.id)}
              >
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: -1,
                    }}
                  >
                    <Typography variant="caption">
                      마감일: {project.deadline || "미정"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={calculateDDay(project.deadline)}
                        color="error"
                        size="small"
                      />
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation(); // 상세 페이지로 이동하는 이벤트 전파를 막음
                          handleScrap(project.id);
                        }}
                      >
                        {isLogin && scrappedPosts.includes(project.id) ? (
                          <BookmarkIcon sx={{ color: "gray" }} /> // 스크랩됨
                        ) : (
                          <BookmarkBorderIcon sx={{ color: "gray" }} /> // 스크랩 안됨
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                  <hr />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: 1 }}
                  >
                    {project.title.length > 12
                      ? project.title.slice(0, 12) + "..."
                      : project.title}
                  </Typography>

                  {/* 기술 스택 표시 */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      marginBottom: 1,
                    }}
                  >
                    {projectStacks[project.projectId]?.length > 0 ? (
                      <>
                        {projectStacks[project.projectId]
                          .slice(0, 3)
                          .map((stack, idx) => (
                            <Chip
                              key={idx}
                              label={`#${stack}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        {projectStacks[project.projectId].length > 3 && (
                          <Chip
                            label={`+${
                              projectStacks[project.projectId].length - 3
                            }`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </>
                    ) : (
                      <Typography variant="body2">기술 스택 없음</Typography>
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "gray", marginBottom: 1 }}
                  >
                    {project.recruitedField
                      ? project.recruitedField
                          .split(",")
                          .map((field) => {
                            const trimmedField = field.trim();
                            const found = position.find(
                              (p) => p.value === trimmedField
                            );
                            return found ? found.label : trimmedField;
                          })
                          .join(", ")
                      : "알 수 없음"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body2">
                      모집 인원: {project.recruitedNumber}
                    </Typography>
                    <Typography variant="body2">
                      지역:{" "}
                      {region.find((r) => r.value === project.region)?.label ||
                        "알 수 없음"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "auto",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {project.user?.nickName || "익명"}
                    </Typography>
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
        sx={{ display: "flex", justifyContent: "center", mt: 3.5, marginBottom: 5 }}
      />
    </div>
  );
};

export default RecruitmentsComponent;
