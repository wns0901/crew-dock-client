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
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // 기본값: 전체 조회
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/posts`)
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${BASE_URL}/admin/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // 카테고리 필터링 함수
  const filteredPosts = posts.filter((post) => {
    // Filter based on the category if needed
    if (filter === "ALL") return post.projectId === null; // Show only posts with projectId null
    if (
      filter === "Q&A" &&
      post.direction === "FORUM" &&
      post.projectId === null
    )
      return true;
    if (
      filter === "FREE" &&
      post.direction === "NONE" &&
      post.projectId === null
    )
      return true;
    return false;
  });
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
        <Typography variant="h5" align="center" gutterBottom component="div">
          Admin Posts List
        </Typography>

        {/* 카테고리 필터 추가 */}
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2, width: "100%" }}
        >
          <MenuItem value="ALL">전체 조회</MenuItem>
          <MenuItem value="Q&A">Q&A 게시판</MenuItem>
          <MenuItem value="FREE">자유게시판</MenuItem>
        </Select>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell
                  sx={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.title}
                </TableCell>
                <TableCell>
                  {post.direction === "FORUM" ? "Q&A 게시판" : "자유게시판"}
                </TableCell>
                <TableCell>{post.name}</TableCell>
                <TableCell>{post.nickname}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(post.id)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPosts;
