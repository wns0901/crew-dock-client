import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const IssueUpdateModal = ({ projectId, issue, onClose }) => {
  const [issueName, setIssueName] = useState(issue.issueName || "");
  const [managerId, setManagerId] = useState(issue.manager?.id || "");
  const [status, setStatus] = useState(issue.status || "");
  const [priority, setPriority] = useState(issue.priority || "");
  const [startDate, setStartDate] = useState(issue.startline || "");
  const [endDate, setEndDate] = useState(issue.deadline || "");
  const [managers, setManagers] = useState([]);

  // 프로젝트 멤버 목록 가져오기
  useEffect(() => {
    axios
      .get(`/projects/${projectId}/members`)
      .then((response) => setManagers(response.data))
      .catch((error) => console.error("프로젝트 멤버 불러오기 실패:", error));
  }, [projectId]);

  // 상태 및 우선순위 변환 매핑
  const priorityMap = {
    HIGH: "높음",
    MIDDLE: "중간",
    LOW: "낮음",
  };

  const reversePriorityMap = {
    "높음": "HIGH",
    "중간": "MIDDLE",
    "낮음": "LOW",
  };

  const statusMap = {
    INPROGRESS: "진행중",
    COMPLETE: "완료",
    YET: "시작안함",
  };

  const reverseStatusMap = {
    "진행중": "INPROGRESS",
    "완료": "COMPLETE",
    "시작안함": "YET",
  };

  const handleSubmit = async () => {
    if (!issueName || !managerId || !status || !priority || !startDate || !endDate) {
      alert("모든 필수 항목을 입력하세요!");
      return;
    }

    const updatedIssue = {
      issueName,
      managerId,
      status: reverseStatusMap[status] || status,
      priority: reversePriorityMap[priority] || priority,
      startline: startDate,
      deadline: endDate,
    };

    try {
      const response = await axios.patch(
        `/projects/${projectId}/issues/${issue.id}`, // 🔹 issue.id를 사용
        updatedIssue,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        alert("이슈 수정 완료");
        onClose();
      }
    } catch (error) {
      console.error("이슈 수정 실패:", error);
      alert("이슈 수정 실패");
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          이슈 수정
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="작업명"
            value={issueName}
            onChange={(e) => setIssueName(e.target.value)}
            required
          />

          <FormControl fullWidth required>
            <InputLabel>담당자</InputLabel>
            <Select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
              {managers.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>상태</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.values(statusMap).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>우선순위</InputLabel>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {Object.values(priorityMap).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              type="date"
              label="시작 날짜"
              InputLabelProps={{ shrink: true }}
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="마감 날짜"
              InputLabelProps={{ shrink: true }}
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Stack>

          <Box textAlign="right">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              수정 완료
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default IssueUpdateModal;
