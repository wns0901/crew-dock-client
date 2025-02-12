import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminStack = () => {
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStackName, setNewStackName] = useState("");

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/stacks`);
      setStacks(response.data);
    } catch (error) {
      console.error("Error fetching stacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStack = async () => {
    if (!newStackName.trim()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/admin/stacks`,
        { name: newStackName },
        { headers: { "Content-Type": "application/json" } }
      );
      setStacks([...stacks, response.data]);
      setNewStackName("");
    } catch (error) {
      console.error("Error adding stack:", error);
    }
  };

  const handleDeleteStack = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin/stacks/${id}`);
      setStacks(stacks.filter((stack) => stack.id !== id));
    } catch (error) {
      console.error("Error deleting stack:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 사이드바 */}
      <Box sx={{ width: 250, flexShrink: 0 }}>
        <AdminSidebar />
      </Box>

      {/* 메인 컨텐츠 */}
      <Box sx={{ flexGrow: 1, ml: 2, maxWidth: 1200, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          스택 관리
        </Typography>

        {/* 새로운 스택 추가 영역 */}
        <Card sx={{ mb: 3, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            새 스택 추가
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="스택 이름"
              variant="outlined"
              fullWidth
              value={newStackName}
              onChange={(e) => setNewStackName(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddStack}>
              추가
            </Button>
          </Box>
        </Card>

        {/* 스택 리스트 */}
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Grid container spacing={3}>
            {stacks.map((stack) => (
              <Grid item xs={12} sm={6} md={4} key={stack.id}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6">{stack.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteStack(stack.id)}
                      fullWidth
                    >
                      삭제
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AdminStack;
