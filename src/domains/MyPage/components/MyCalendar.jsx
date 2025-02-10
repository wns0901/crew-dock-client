import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AddSchedule from './AddSchedule';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Divider, Box, List, ListItem, Card, CardContent, ListItemText } from '@mui/material';

const MyCalendar = ({ projectId }) => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]); // 공휴일 데이터를 저장할 상태
  const [todays, setTodayEvents] = useState([]); // 오늘의 일정 데이터 저장할 상태
  const { userInfo } = useContext(LoginContext);
  const userId = userInfo?.id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  useEffect(() => {
    if (!userId) return;

    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/calendars?userId=${userId}`);
        console.log("캘린더 API 응답:", response.data); // 응답 데이터 확인

        // 응답 데이터가 JSON 형식인 경우에만 처리
        if (Array.isArray(response.data)) {
          const formattedEvents = response.data.map(event => ({
            id: event.id,
            title: event.content,
            start: event.startDate,
            end: event.endDate,
            isHoliday: event.isHoliday || false, 
          }));
          setEvents(formattedEvents);
        } else {
          console.error('유효한 JSON 데이터가 아닙니다.');
        }
      } catch (error) {
        console.error("Failed to fetch calendar events", error);
      }
    };

    fetchCalendarData();
  }, [userId]);

   // 오늘 일정 데이터를 가져오는 함수
   useEffect(() => {
    if (!userId) return;

    const fetchTodayEvents = async () => {
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD) 형식으로 변환
      console.log("오늘 날짜: ",  today);
      try {
        const response = await axios.get(`http://localhost:8081/calendars/today?date=${today}`);
        console.log("오늘 일정 API 응답:", response.data);

        if (Array.isArray(response.data)) {
          const formattedTodayEvents = response.data.map(event => ({
            id: event.id,
            content: event.content,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime
          }));
          setTodayEvents(formattedTodayEvents);
        } else {
          console.error('유효한 JSON 데이터가 아닙니다.');
        }
      } catch (error) {
        console.error("Failed to fetch today's calendar events", error);
      }
    };

    fetchTodayEvents();
  }, [userId]);

  const handleDateSelect = (info) => {
    setSelectedDate(info.startStr);
    console.log("Select Date: ", info.startStr);
    setAnchorEl(info.jsEvent.target);
    setIsModalOpen(true);
  };

   // 일정 추가 후, 상태 업데이트 함수
   const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // 동적으로 이벤트 추가
  };


  // 해당 일정 클릭 시, AddSchedule.jsx가 열리는 클릭 이벤트 함수
  const openModal = (info) => {
    // 클릭한 이벤트 정보가 담긴 `info`에서 필요한 데이터를 추출
    const selectedEvent = {
      id: info.event.id,
      content: info.event.title, // 제목
      startDate: info.event.startStr, // 시작 날짜
      endDate: info.event.endStr, // 종료 날짜
    };
  
    // `selectedDate`를 클릭한 일정의 시작 날짜로 설정
    setSelectedDate(info.event.startStr);
  
    // `AddSchedule` 모달을 열기 위해 상태를 업데이트
    setIsModalOpen(true);
  };

  const formatTime = (time) => {
    // LocalTime 객체를 Date 객체로 변환
    const date = new Date();
    const [hours, minutes] = time.split(":").map((val) => parseInt(val, 10));
    date.setHours(hours, minutes, 0);
  
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  return (
    <div style={{ display: 'flex' }}>
    {/* Today's events section */}
    <Box
      sx={{
        width: '25%', // 1:3 비율로 설정
        marginRight: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
      }}
    >
      <h3> Todays </h3>
      <Divider sx={{ marginBottom: 2 }} />
      <List>
        {todays.length > 0 ? (
          todays.map((event) => (
            <ListItem key={event.id}>
              <Card sx={{ width: '100%', marginBottom: 1 }}>
                <CardContent>
                  <ListItemText
                    primary={event.content}
                    secondary={`${formatTime(event.startTime)} ~ ${formatTime(event.endTime)}`}
                  />
                </CardContent>
              </Card>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="오늘 일정이 없습니다." />
          </ListItem>
        )}
      </List>
    </Box>

    {/* FullCalendar section */}
    <div style={{ flex: 3 }}>
      <h4>{userId ? `${userId}님의 캘린더` : "로그인 정보 없음"}</h4>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}
        timeZone="Asia/Seoul"
        firstDay={0}
        weekends={true}
        eventColor="#ccdcf4"
        eventTextColor="#000000"
        eventBackgroundColor="#ccdcf4"
        eventClick={openModal}
      />
      {isModalOpen && (
        <AddSchedule
          userId={userId}
          selectedDate={selectedDate}
          anchorEl={anchorEl}
          onClose={() => setIsModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  </div>
);
};


export default MyCalendar;
