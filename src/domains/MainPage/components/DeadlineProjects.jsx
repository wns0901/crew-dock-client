import React, { useEffect, useState } from "react";
import api from "../../../apis/baseApi";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { position, region } from "./Filter";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// 마감 3일전 것을 안 뽀ㅂ아옴 

const DeadlineProjects = () => {
  const [projects, setProjects] = useState([]);
  // 스택 가져오기
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

  // 3일전으로 가져오는걸 여기서 해야하나? 
  useEffect(() => {
    api.get("/recruitments?sort=deadline") 
      .then(response => setProjects(response.data.content))
      .catch(error => console.error("데이터 가져오기 실패:", error));
  }, []);

  return (
    <div>
      <Typography variant="h6" sx={{ margin: 2 }}> 곧 모집 마감인 프로젝트</Typography>
      <Grid container spacing={3}>
        {projects.slice(0, 4).map((project) => (
          <Grid item xs={12} sm={6} md={3} sx={{ m: 1 }} key={project.id}>
         <Card sx={{ minWidth: 180, maxWidth: 290, height: 200 }}>
              <CardContent>
                <Typography variant="body2">마감일: {project.deadline}</Typography>
                <BookmarkBorderIcon/>
                <hr></hr>
                <Typography variant="h6">[{project.title}]</Typography>
                <Typography variant="body2">{getPositopnName(project.recruitedField)}</Typography>
                사용기술스텍
                {/* <Stack direction="row" spacing={2}>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                </Stack> */}
                <Typography variant="body2">모집인원:0/{project.recruitedNumber}</Typography>
                <Typography variant="body2">지역:{getRegionName(project.region)}</Typography>
                <Typography variant="body2">{project.nickName}/댓글수</Typography>
               </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ marginBottom: 2 }}> 전체 프로젝트 모집글</Typography>
    </div>
  );
};

export default DeadlineProjects;