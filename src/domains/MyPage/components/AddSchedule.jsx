import React, { useState } from "react";
import axios from "axios";
import { Popover, TextField, Button, Box, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddSchedule = ({ userId, projectId, selectedDate, anchorEl, onClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    content: "",
    startTime: dayjs().hour(0).minute(0), // 기본값 00:00
    endTime: dayjs().hour(23).minute(59), // 기본값 23:59
    startDate: dayjs(selectedDate),
    endDate: dayjs(selectedDate),
    project: projectId || null, // 프로젝트 ID 선택사항
  });

  // 입력 필드 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 일정 추가 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 서버 API에 맞게 요청 URL 변경
      const response = await axios.post(
        `http://localhost:8081/calendars?userId=${userId}`, 
        {
          content: formData.content,
          startDate: formData.startDate.format("YYYY-MM-DD"),
          endDate: formData.endDate.format("YYYY-MM-DD"),
          startTime: formData.startTime.format("HH:mm"),
          endTime: formData.endTime.format("HH:mm"),
          project: formData.project, // 프로젝트 ID가 있을 경우 포함
        }
      );

      // 서버에서 받은 일정 정보로 새 이벤트 추가
      onAddEvent({
        id: response.data.id,
        title: response.data.content,
        start: response.data.startDate,
        end: response.data.endDate,
      });

      onClose(); // 모달 닫기

    } catch (error) {
      console.error("Failed to add schedule", error);
    }
  };

  // 취소 버튼 클릭 시 모달 닫기
  const handleCancelClick = () => {
    onClose(); // 모달 닫기
  };

  // 추가 버튼 클릭 시 일정 추가
  const handleAddClick = (event) => {
    handleSubmit(event); // 일정 추가 함수 호출
  };


  return (
    <Popover
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6">일정 추가</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="일정"
          fullWidth
          margin="normal"
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          required
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="시작 날짜"
            value={formData.startDate}
            onChange={(newValue) => handleChange("startDate", newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          <TimePicker
            label="시작 시간"
            value={formData.startTime}
            onChange={(newValue) => handleChange("startTime", newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          <DatePicker
            label="종료 날짜"
            value={formData.endDate}
            onChange={(newValue) => handleChange("endDate", newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          <TimePicker
            label="종료 시간"
            value={formData.endTime}
            onChange={(newValue) => handleChange("endTime", newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        {/* 하루종일 버튼 -> 시작 날짜 00:00 ~ 23:59 까지로 자동 선택됨 */}
        </LocalizationProvider>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          {/* 취소 버튼에 onClick 추가 */}
          <Button onClick={handleCancelClick} variant="outlined">취소</Button>
          {/* 추가 버튼에 onClick 추가 */}
          <Button type="submit" variant="contained" color="primary" onClick={handleAddClick}>추가</Button>
        </Box>
      </form>
    </Box>
  </Popover>
);
};

export default AddSchedule;
