import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminRecruitmentPost = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/recruitmentposts`)
      .then((response) => {
        setRecruitmentPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recruitment posts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 사이드바 */}
      <div style={{ width: "250px", flexShrink: 0 }}>
        <AdminSideBar />
      </div>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 900, margin: "20px auto", padding: 2 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Recruitment Posts
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recruitmentPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.userId}</TableCell>
                <TableCell>{post.nickname}</TableCell>
                <TableCell>{post.name}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminRecruitmentPost;
