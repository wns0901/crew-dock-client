import React, { useEffect, useState } from "react";
import api from "../../../apis/baseApi";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const DeadlineProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/recruitments?sort=deadline") 
      .then(response => setProjects(response.data.content))
      .catch(error => console.error("데이터 가져오기 실패:", error));
  }, []);

  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: 2 }}> 곧 모집 마감인 프로젝트</Typography>
      <Grid container spacing={3}>
        {projects.slice(0, 4).map((project) => (
          <Grid item xs={12} sm={6} md={3} sx={{ m: 1 }} key={project.id}>
         <Card sx={{ minWidth: 180, maxWidth: 290, height: 170 }}>
              <CardContent>
                <Typography variant="h6">[{project.title}]</Typography>
                <Typography variant="body2">마감일: {project.deadline}</Typography>
                <Typography variant="body2">{project.recruitedField}</Typography>
                <Typography variant="body2">모집인원:{project.recruitedNumber}</Typography>
                <Typography variant="body2">지역:{project.region}</Typography>
                {/* <Typography variant="h1">이건 H1 제목</Typography>
                    <Typography variant="h6">이건 H6 제목</Typography>
                    <Typography variant="body1">이건 본문(body1)</Typography>
                    <Typography variant="body2">이건 작은 본문(body2)</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DeadlineProjects;