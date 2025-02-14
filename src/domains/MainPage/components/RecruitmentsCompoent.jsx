import React, { useEffect, useState } from 'react';
import api from '../../../apis/baseApi';
import { position, proceedMethod, region } from "../components/Filter";
import { TextField, MenuItem, Grid, Card, CardContent, Typography, Pagination, Box } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';


const RecruitmentsCompoent = () => {
  const [filters, setFilters] = useState({ stack: "", position: "", progress: "", region: "" });
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stacks, setStacks] = useState([]);

  useEffect(() => {
    api.get("/stacks")
      .then(response => setStacks(response.data))
      .catch(error => console.error("스택 목록 불러오기 실패:", error));
  }, []);

  const getRegionName = (name) => {
     const found = region.find(r => r.value === name);
     return found ? found.label : "알 수 없음"; 
   };
   
   const getPositopnName = (name) => { 
     const found = position.find(p => p.value === name);
     return found ? found.label : "알 수 없음"; 
   };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.stack) params.append("stack", filters.stack);
    if (filters.position) params.append("position", filters.position);
    if (filters.progress) params.append("proceedMethod", filters.progress);
    if (filters.region) params.append("region", filters.region);
    params.append("page", page);

    api.get(`/recruitments/filter?${params.toString()}`)
      .then(response => {
        setProjects(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error("데이터 가져오기 실패:", error));
  }, [filters, page]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {/* 필터 UI */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 2 }}>
        <TextField select label="기술 스택" value={filters.stack} onChange={(e) => handleChange("stack", e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {stacks.map((stack) => (
            <MenuItem key={stack.id} value={stack.name}>{stack.name}</MenuItem>
          ))}
        </TextField>

        <TextField select label="포지션" value={filters.position} onChange={(e) => handleChange("position", e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {position.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>

        <TextField select label="진행 방식" value={filters.progress} onChange={(e) => handleChange("progress", e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {proceedMethod.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>

        <TextField select label="지역" value={filters.region} onChange={(e) => handleChange("region", e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">전체</MenuItem>
          {region.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
      </Box>
      {/* 필터 UI */}
      {/* 프로젝트 리스트 */}
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {projects.length === 0 ? (
          <Typography variant="h6">모집 중인 프로젝트가 없습니다.</Typography>
        ) : (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography variant="body2">마감일: {project.deadline}</Typography>
                  <BookmarkBorderIcon/>
                  <hr />
                  <Typography variant="h6">[{project.title}]</Typography>
                  <Typography variant="h6">{project.stack}</Typography> {/* 스택 끌어올리기 노력중 */}
                  <Typography variant="body2">{getPositopnName(project.recruitedField)}</Typography>
                  <Typography variant="body2">{project.recruitedField}</Typography>
                  <Typography variant="body2">모집인원:0/{project.recruitedNumber}</Typography>
                  <Typography variant="body2">지역:{getRegionName(project.region)}</Typography>
                  <Typography variant="body2">{project.nickName}/댓글수</Typography>
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
        

export default RecruitmentsCompoent;
