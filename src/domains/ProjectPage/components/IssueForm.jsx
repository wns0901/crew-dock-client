import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const IssueForm = ({ onSave, editTask, assignees }) => {
  const [task, setTask] = useState({
    name: "",
    assignee: "",
    status: "진행중",
    priority: "낮음",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    }
  }, [editTask]);

  const handleChange = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!task.name || !task.assignee || !task.startDate || !task.endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    onSave(task);
    setTask({
      name: "",
      assignee: "",
      status: "",
      priority: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", p: 1 }}>
        {/* 작업명 입력 */}
        <TextField
          label="작업명"
          variant="outlined"
          size="small"
          value={task.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {/* 담당자 선택 */}
        <Select
          value={task.assignee}
          onChange={(e) => handleChange("assignee", e.target.value)}
          size="small"
          displayEmpty
        >
          <MenuItem value="" disabled>
            담당자 선택
          </MenuItem>
          {assignees.map((member) => (
            <MenuItem key={member.id} value={member.name}>
              {member.name}
            </MenuItem>
          ))}
        </Select>
        {/* 상태 선택 */}
        <Select
          value={task.status}
          onChange={(e) => handleChange("status", e.target.value)}
          size="small"
        >
          <MenuItem value="진행중">진행중</MenuItem>
          <MenuItem value="완료">완료</MenuItem>
          <MenuItem value="시작 안함">시작 안함</MenuItem>
        </Select>
        {/* 우선순위 선택 */}
        <Select
          value={task.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          size="small"
        >
          <MenuItem value="높음">높음</MenuItem>
          <MenuItem value="중간">중간</MenuItem>
          <MenuItem value="낮음">낮음</MenuItem>
        </Select>
        {/* 시작 날짜 선택 */}
        <DatePicker
          label="시작 날짜"
          value={task.startDate}
          onChange={(newValue) => handleChange("startDate", newValue)}
          format="YYYY-MM-DD"
          slotProps={{ textField: { size: "small" } }}
        />
        {/* 마감 날짜 선택 */}
        <DatePicker
          label="마감 날짜"
          value={task.endDate}
          onChange={(newValue) => handleChange("endDate", newValue)}
          format="YYYY-MM-DD"
          slotProps={{ textField: { size: "small" } }}
        />
        {/* 저장 버튼 */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          저장
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default IssueForm;
