import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/admin/users`) // 백엔드 API 호출
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (userId) => {
    confirm("해당 유저를 탈퇴 처리할까요?") &&
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    alert("탈퇴 처리되었습니다.");
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
    {/* 사이드바 */}
    <div style={{ width: "250px", flexShrink: 0 }}>
    <AdminSidebar />
  </div>
    <TableContainer component={Paper} sx={{ maxWidth: 1100, margin: "20px auto", padding: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Admin User List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>가입일</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell
                sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                onClick={() => navigate(`/mypage/${user.id}`)}
              >
                {user.name}
              </TableCell>
              <TableCell>{user.nickname}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.hopePosition}</TableCell>
              <TableCell>{new Date(user.createDate).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDelete(user.id)}>
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

export default AdminUser;
