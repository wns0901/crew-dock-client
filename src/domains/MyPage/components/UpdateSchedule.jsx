import React, { useState, useEffect } from "react";
import axios from "axios";
import { Popover, TextField, Button, Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Check, Close, Delete } from "@mui/icons-material";
import api from "../../../apis/baseApi";

const UpdateSchedule = ({ userId, projectId, calendarId, anchorEl, onClose, onUpdateEvent, onDeleteEvent }) => {
  const [formData, setFormData] = useState({
    content: "",
    startTime: dayjs().hour(0).minute(0), // 기본값 00:00
    endTime: dayjs().hour(23).minute(59), // 기본값 23:59
    startDate: dayjs(),
    endDate: dayjs(),
    project: projectId || null, // 프로젝트 ID 선택사항
  });

  // 수정할 일정 데이터 가져오기
  useEffect(() => {
    if (calendarId) {
      const fetchData = async () => {
        try {
          const response = await api.get( `/calendars/${calendarId}`);
          console.log("선택된 캘린더 ID: ", calendarId);
          const data = response.data;
          console.log("수정할 데이터: ", data);
  
          // 날짜와 시간을 합쳐서 포맷팅
          const startDate = dayjs(data.startDate).hour(dayjs(data.startTime, "HH:mm:ss").hour()).minute(dayjs(data.startTime, "HH:mm:ss").minute());
          const endDate = dayjs(data.endDate).hour(dayjs(data.endTime, "HH:mm:ss").hour()).minute(dayjs(data.endTime, "HH:mm:ss").minute());
  
          setFormData({
            content: data.content,
            startDate: startDate,
            endDate: endDate,
            startTime: startDate,
            endTime: endDate,
            project: data.projectId || null,
          });
        } catch (error) {
          console.error("Failed to fetch calendar details", error);
        }
      };
      fetchData();
    }
  }, [calendarId]);

  // 입력 필드 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 일정 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 서버 API에 맞게 요청 URL 변경 (PATCH)
      const response = await axios.patch(
        api + `/calendars/${calendarId}`,
        {
          content: formData.content,
          startDate: formData.startDate.format("YYYY-MM-DD"),
          endDate: formData.endDate.format("YYYY-MM-DD"),
          startTime: formData.startTime.format("HH:mm"),
          endTime: formData.endTime.format("HH:mm"),
          project: formData.project,
        }
      );

      // 서버에서 받은 수정된 일정 정보로 이벤트 업데이트
      onUpdateEvent({
        id: response.data.id,
        title: response.data.content,
        start: response.data.startDate,
        end: response.data.endDate,
        sTime: response.data.startTime,
        eTime: response.data.endTime
      });
      onClose(); // 모달 닫기

      alert("일정 수정이 완료되었습니다.");
    } catch (error) {
      console.error("Failed to update schedule", error);
      alert("일정 수정에 실패했습니다.");
    }
  };

  // 일정 삭제
  const handleDelete = async () => {
    if (window.confirm("해당 일정을 삭제하시겠습니까?")) {
      try {
        await axios.delete( api + `/calendars`, {
          params: { userId, calendarId },
        });
        onClose(); // 모달 닫기
        onDeleteEvent(calendarId); // 삭제된 이벤트 반영
        alert("일정이 삭제되었습니다.");
      } catch (error) {
        console.error("Failed to delete schedule", error);
        alert("일정 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClick={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1.5rem",
          p: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          position: "absolute",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "transparent",
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "grey.500",
        }}
      >
        <Close/>
      </IconButton>

      <DialogTitle>
        <Typography variant="h4" className="font-bold text-center">
          일정 수정
        </Typography>
      </DialogTitle>

        <DialogContent>
          <Box className="space-y-4">
            <form onSubmit={handleSubmit}>
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
                              sx={{ marginBottom: "1.5rem", marginRight: "2rem"}} // 추가된 마진
                            />
              
                            <TimePicker
                              label="시작 시간"
                              value={formData.startTime}
                              onChange={(newValue) => handleChange("startTime", newValue)}
                              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                              sx={{ marginBottom: "1rem"}} // 추가된 마진
                            />
              
                            <DatePicker
                              label="종료 날짜"
                              value={formData.endDate}
                              onChange={(newValue) => handleChange("endDate", newValue)}
                              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                              sx={{ marginBottom: "1.5rem", marginRight: "2rem"}} // 추가된 마진
                            />
              
                            <TimePicker
                              label="종료 시간"
                              value={formData.endTime}
                              onChange={(newValue) => handleChange("endTime", newValue)}
                              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                          </LocalizationProvider>

                          <Box sx={{
                            mt: 0.5,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}>
                              <Button
                                type="button"
                                onClick={handleDelete}
                                variant="contained"
                                color="primary"
                                startIcon={<Delete />}
                                className="rounded-lg"
                                sx={{
                                  marginRight: "0.5rem"
                                }}
                              >
                                삭제
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<Check/>}
                                className="rounded-lg"
                              >
                                수정 완료
                              </Button>
                            </Box>
            </form>
          </Box>
        </DialogContent>
    </Dialog>

  );
};

export default UpdateSchedule;
