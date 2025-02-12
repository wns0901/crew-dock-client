import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Divider, Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import FlagIcon from "@mui/icons-material/Flag";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const GitData = () => {
  const { projectId } = useParams();
  const [gitData, setGitData] = useState([]);
  const [error, setError] = useState(null);
  const [gitUrls, setGitUrls] = useState([]);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}`);
        if (!response.ok) throw new Error("프로젝트 정보를 가져오는데 실패했습니다.");
        const data = await response.json();

        const urls = [];
        if (data.githubUrl1) urls.push(data.githubUrl1);
        if (data.githubUrl2) urls.push(data.githubUrl2);

        setGitUrls(urls);
      } catch (error) {
        setError(error);
      }
    };
    fetchProjectInfo();
  }, [projectId]);

  useEffect(() => {
    if (gitUrls.length === 0) return;

    const fetchGitData = async () => {
      try {
        const url = `${BASE_URL}/projects/${projectId}/githubs?gitURL=${gitUrls.join("&gitURL=")}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("깃허브 데이터를 가져오는데 실패했습니다.");
        const data = await response.json();

        setGitData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchGitData();
  }, [gitUrls, projectId]);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!gitData || gitData.length === 0) {
    return <Typography>GitHub 데이터를 불러오는 중입니다...</Typography>;
  }

  const sortByDate = (a, b) => {
    const dateA = new Date(a.date || a.created_at);
    const dateB = new Date(b.date || b.created_at);
    return dateB - dateA;
  };

  const sortedCommits = gitData.flatMap(repo => repo.commits.map(commit => ({
    type: "commit",
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    firstUrl: commit.firstUrl
  }))).sort(sortByDate);

  const sortedPulls = gitData.flatMap(repo => repo.pulls.map(pull => ({
    type: "pull",
    id: pull.id,
    title: pull.title,
    date: pull.created_at,
    firstUrl: pull.firstUrl,
    author: pull.user ? pull.user.login : "작성자 없음", // 작성자 정보 추가
  }))).sort(sortByDate);
  

  const sortedIssues = gitData.flatMap(repo => repo.issues.map(issue => ({
    type: "issue",
    id: issue.id, // issue ID 추가
    title: issue.title,
    author: issue.user.login,
    date: issue.created_at,
    firstUrl: issue.firstUrl
  }))).sort(sortByDate);

  const filterData = (data) => {
    if (filter === "전체") {
      return data;
    }
    return data.filter(item => {
      const isGithubUrl1 = filter === "data.githubUrl1" && item.firstUrl === true;
      const isGithubUrl2 = filter === "data.githubUrl2" && item.firstUrl === false;
      return (filter === "data.githubUrl1" && isGithubUrl1) ||
             (filter === "data.githubUrl2" && isGithubUrl2) ||
             filter === "전체";
    });
  };

  const filteredCommits = filterData(sortedCommits);
  const filteredPulls = filterData(sortedPulls);
  const filteredIssues = filterData(sortedIssues);

  return (
    <Box sx={{ padding: 2 }}>
      <Card sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            GitHub 데이터
          </Typography>

          <Box sx={{ marginBottom: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="filter-select-label">필터링</InputLabel>
              <Select
                labelId="filter-select-label"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="필터링"
              >
                <MenuItem value="전체">전체</MenuItem>
                {gitUrls[0] && <MenuItem value="data.githubUrl1">{gitUrls[0]}</MenuItem>}
                {gitUrls[1] && <MenuItem value="data.githubUrl2">{gitUrls[1]}</MenuItem>}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {/* 왼쪽 섹션: 커밋 */}
            <Grid item xs={12} sm={6}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxHeight: 500,
              }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>커밋</Typography>
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    border: "2px solid #ccc",
                    padding: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  {filteredCommits.map((commit, i) => (
                    <Box
                    onClick={() => window.location.href = commit.firstUrl ? gitUrls[0] : gitUrls[1]}
                      key={`commit-${i}`}
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        border: "2px solid",
                        borderColor: commit.firstUrl ? "green" : "yellow",
                        borderRadius: 2,
                      }}
                    >
                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="caption">ID: {commit.sha}</Typography>
    <Typography variant="body2" color="textSecondary">{commit.date}</Typography>
  </Box>
  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{commit.message}</Typography>
  <Typography variant="body2">작성자: {commit.author}</Typography>
</Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* 오른쪽 섹션: 풀 리퀘스트 및 이슈 */}
            <Grid item xs={12} sm={6}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxHeight: 500,
              }}>
                {/* 풀 리퀘스트 */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>풀 리퀘스트</Typography>
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        marginBottom: 3,
        border: "2px solid #ccc",
        padding: 2,
        borderRadius: 2,
      }}
    >
      {filteredPulls.map((pull, i) => (
        <Box
        onClick={() => window.location.href = pull.firstUrl ? gitUrls[0] : gitUrls[1]}
          key={`pull-${i}`}
          sx={{
            marginBottom: 2,
            padding: 2,
            border: "2px solid",
            borderColor: pull.firstUrl ? "green" : "yellow",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="caption">ID: {pull.id}</Typography>
    <Typography variant="body2" color="textSecondary">{pull.date}</Typography>
  </Box>
  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{pull.title}</Typography>
  <Typography variant="body2">작성자: {pull.author}</Typography>
</Box>
      ))}
    </Box>

        

                {/* 이슈 */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>이슈</Typography>
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    border: "2px solid #ccc",
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  {filteredIssues.map((issue, i) => (
                    <Box
                    onClick={() => window.location.href = issue.firstUrl ? gitUrls[0] : gitUrls[1]}
                      key={`issue-${i}`}
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        border: "2px solid",
                        borderColor: issue.firstUrl ? "green" : "yellow",
                        borderRadius: 2,
                        cursor: "pointer",
                      }}
                    >
                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="caption">ID: {issue.id}</Typography> {/* 작은 글씨 */}
    <Typography variant="body2" color="textSecondary">{issue.date}</Typography> {/* 우측 정렬 */}
  </Box>

  {/* 제목 */}
  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{issue.title}</Typography>

  {/* 작성자 */}
  <Typography variant="body2">작성자: {issue.author}</Typography>
</Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GitData;
