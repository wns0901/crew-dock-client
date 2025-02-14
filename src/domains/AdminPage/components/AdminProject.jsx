import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import AdminSideBar from "./AdminSideBar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // 프로젝트 목록 가져오기
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/projects`);
      setProjects(response.data);
    } catch (error) {
      toast.error("프로젝트 데이터 로드 실패!");
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 삭제
  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
      toast.success("프로젝트가 삭제되었습니다.");
    } catch (error) {
      toast.error("프로젝트 삭제 실패!");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 사이드바: 왼쪽에 고정 */}
      <div
        style={{
          width: "250px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <AdminSideBar />
      </div>

      {/* 메인 콘텐츠 */}
      <div
        style={{
          flexGrow: 1,
          padding: "24px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          프로젝트 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchProjects}
          style={{ marginBottom: "16px" }}
        >
          프로젝트 데이터 새로 고침
        </Button>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Card variant="outlined">
            <CardHeader title="프로젝트 목록" />
            <CardContent>
              {projects.length === 0 ? (
                <Typography>등록된 프로젝트가 없습니다.</Typography>
              ) : (
                <List>
                  {projects.map((project) => (
                    <ListItem
                      key={project.id}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <ListItemText
                        primary={`${project.name} (${project.status})`}
                        secondary={
                          <>
                            <div>설명: {project.introduction}</div>
                            <div>
                              등록일:{" "}
                              {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </>
                        }
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        삭제
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProject;
