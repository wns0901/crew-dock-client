import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Add, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import api from "../../../apis/baseApi";

const AddProjectSchedule = ({ projectId, userId, selectedDate, onClose, events, setEvents, todays, setTodays, onAddSchedule, anchorEl }) => {
  const [formData, setFormData] = useState({
    content: "",
    userId: userId,
    startTime: dayjs().hour(0).minute(0), // 기본값 00:00
    endTime: dayjs().hour(23).minute(59), // 기본값 23:59
    startDate: dayjs(selectedDate),
    endDate: dayjs(selectedDate),
    project: projectId || null, // 프로젝트 ID가 반드시 포함
  });

  // 입력 필드 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 팀 일정 추가 요청
  const handleSubmit = async (e) => {
    console.log("userId", userId);
    
    e.preventDefault();
    try {
      // 서버 API에 맞게 요청 URL 변경
      const response = await api.post(
        `/calendars/project?projectId=${projectId}&userId=${userId}`,
        {
          userId: formData.userId,
          content: formData.content,
          startDate: formData.startDate.format("YYYY-MM-DD"),
          endDate: formData.endDate.format("YYYY-MM-DD"),
          startTime: formData.startTime.format("HH:mm:ss"),
          endTime: formData.endTime.format("HH:mm:ss"),
          projectId: formData.projectId, // 프로젝트 ID 포함
          isHoliday: formData.isHoliday,
        }
      );

      const eventData = {
        id: response.data.id,
        title: response.data.content,
        start: response.data.startDate,
        end: response.data.endDate,
        sTime: response.data.startTime,
        eTime: response.data.endTime,
        projectId: response.data.projectId,
        isHoliday: response.data.holiday || false
      };

      // setEvents(prev => new Set([...prev, eventData]));

     // 오늘 일정 필터링
     const today = new Date();
     if (Array.isArray(response.data)) {
       const filteredEvents = response.data
         .filter((event) => {
           const eventStartDate = new Date(event.start);
           const eventEndDate = new Date(event.end);
           return (
             eventStartDate.toDateString() === today.toDateString() ||
             (eventStartDate <= today && eventEndDate >= today)
           );
         })
         .sort((a, b) => {
           // 시작 시간이 빠른 일정이 먼저 오도록 정렬
           if (!a.sTime || !b.sTime) return 0; // 시작 시간이 없으면 정렬하지 않음
           return a.sTime.localeCompare(b.sTime);
         });
   
        // setTodays(filteredEvents); // 필터링된 일정만 업데이트
        setTodays([... todays, eventData])
        console.log("오늘의 일정: ", filteredEvents);
        //  setTodays(filteredEvents);
        }
        setTodays((prevEvents) => prevEvents.map((event) => (event.id === eventData.id ? eventData : event)));
        // setTodays(prev => new Set([...prev, eventData]));
        onClose(); // 모달 닫기
        onAddSchedule(response.data);
        alert("일정이 추가되었습니다.");

    } catch (error) {
      console.error("Failed to add project schedule", error);
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
    <Dialog
      anchorEl={true}
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1.5rem",
          p: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          position: "absolute",  // 이 부분을 추가하여 날짜 근처로 위치시킬 수 있음
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "transparent",  // 배경을 투명하게 설정
        }
      }}
    >
      <IconButton
        onClick={handleCancelClick}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "grey.500",
        }}
      >
        <Close />
      </IconButton>

      <DialogTitle>
        <Typography variant="h4" className="font-bold text-center">
          팀 일정 추가
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box className="space-y-4">
          <form onSubmit={handleAddClick}>
            <TextField
              label="일정"
              fullWidth
              margin="normal"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              required
              sx={{ borderRadius: "0.5rem", marginBottom: "2rem" }} // 추가된 마진
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="시작 날짜"
                value={formData.startDate}
                onChange={(newValue) => handleChange("startDate", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                sx={{ marginBottom: "1.5rem", marginRight: "2rem" }} // 추가된 마진
              />

              <TimePicker
                label="시작 시간"
                value={formData.startTime}
                onChange={(newValue) => handleChange("startTime", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                sx={{ marginBottom: "1rem" }} // 추가된 마진
              />

              <DatePicker
                label="종료 날짜"
                value={formData.endDate}
                onChange={(newValue) => handleChange("endDate", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                sx={{ marginBottom: "1.5rem", marginRight: "2rem" }} // 추가된 마진
              />

              <TimePicker
                label="종료 시간"
                value={formData.endTime}
                onChange={(newValue) => handleChange("endTime", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>

            <Box
              sx={{
                mt: 0.5,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                className="rounded-lg"
              >
                추가
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectSchedule;
