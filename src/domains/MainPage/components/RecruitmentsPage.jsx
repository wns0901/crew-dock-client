import React, { useEffect, useState } from 'react';
import api from '../../../apis/baseApi';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

const RecruitmentsPage = () => {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const res = api.get(`/recruitments?page=${page}`); // 기존 스타일 유지

        res.then(response => {
            setProjects(response.data.content); // `content` 부분만 저장
            setTotalPages(response.data.totalPages); // 전체 페이지 개수 저장
        }).catch(error => {
            console.error("데이터 가져오기 실패:", error);
        });

    }, [page]);

    return (
      <div>
        <Grid container spacing={3} sx={{ padding: 2 }}>
          {projects.length === 0 ? (
            <Typography variant="h6">모집 중인 프로젝트가 없습니다.</Typography>
          ) : (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* 페이지네이션 추가 */}
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(event, value) => setPage(value)}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        />
      </div>
    );
};

export default RecruitmentsPage;