import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AddSchedule from './AddSchedule';
import UpdateSchedule from './UpdateSchedule';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Divider, Box, List, ListItem, Card, CardContent, ListItemText, Checkbox } from '@mui/material';

const MyCalendar = ({}) => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]); // 공휴일 데이터를 저장할 상태
  const [todays, setTodayEvents] = useState([]); // 오늘의 일정 데이터 저장할 상태
  const [completedEvents, setCompletedEvents] = useState(new Set()); // 체크된 일정 ID 저장
  const {userInfo, projectRoles} = useContext(LoginContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 일정 추가 모달 상태
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태
  const [selectedEvent, setSelectedEvent] = useState(null); // 수정할 이벤트 상태
  const [anchorEl, setAnchorEl] = useState();
  const [userId, setUserId] = useState(null);

  // 로그인한 유저 ID
  useEffect(() => {
    if (userInfo?.id) {
      setUserId(userInfo.id);
    }
  }, [userInfo]);

  // 본인이 속한 프로젝트 ids
  console.log("userInfo: ", userInfo);
  console.log("로그인한 userId: ", userId);

  const projectIds = Array.isArray(projectRoles)
  ? projectRoles.map(role => role.projectId)
  : []; // projectRoles가 배열이 아닐 경우 빈 배열로 처리

  console.log("추출한 projectIds: ", projectIds);

  // 모든 일정 가져오기
  useEffect(() => {
    if (!userId) return;
  
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/calendars?userId=${userId}`);
        console.log("캘린더 API 응답:", response.data); // 응답 데이터 확인
  
        if (Array.isArray(response.data)) {
          const formattedEvents = response.data.map(event => {
            
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            
            // 시간 설정: startTime과 endTime이 있다면 날짜에 시간을 더해줍니다.
            if (event.startTime) {
              const [startHour, startMinute] = event.startTime.split(":");
              startDate.setHours(startHour, startMinute);
            }
  
            if (event.endTime) {
              const [endHour, endMinute] = event.endTime.split(":");
              endDate.setHours(endHour, endMinute);
            }
  
            return {
              id: event.id,
              title: event.content,
              start: event.startDate,
              end: event.endDate,
              sTime: event.startTime,
              eTime: event.endTime,
              projectId: event.projectId,
              isHoliday: event.isHoliday || false
            };
          });
  
          // 오늘의 일정 필터링
          const today = new Date();
          const todaysEvents = formattedEvents
            .filter(event => {
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
  
          setEvents(formattedEvents);  // 전체 일정
          setTodayEvents(todaysEvents); // 오늘 일정만 따로 저장
  
          console.log("오늘의 일정: ", todaysEvents);
          console.log("Formatted Event:", formattedEvents);
        } else {
          console.error('유효한 JSON 데이터가 아닙니다.');
        }
      } catch (error) {
        console.error("Failed to fetch calendar events", error);
      }
    };
  
    fetchCalendarData();
  }, [userId]);

  const handleDateSelect = (info) => {
    setSelectedDate(info.startStr);
    console.log("Select Date: ", info.startStr);
    setAnchorEl(info.jsEvent.target);
    setIsAddModalOpen(true); // 날짜 클릭 시 일정 추가 모달 열기
  };

  const handleEventClick = (info) => {
    console.log("info:", info);
    // 클릭한 일정의 정보를 선택하여 수정 모달을 열기
    const selectedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      sTime: info.event.extendedProps.sTime || '', // startTime이 없으면 빈 문자열로 설정
      eTime: info.event.extendedProps.eTime || ''    // endTime이 없으면 빈 문자열로 설정
    };
    setSelectedEvent(selectedEvent);
    console.log("선택한 일정: ", selectedEvent);
    setIsUpdateModalOpen(true); // 수정 모달 열기
  };

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];  // 새로 추가된 이벤트 추가
      console.log("새로 추가한 일정: ", newEvent);  // 추가된 일정 출력
      return updatedEvents;
    });
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prevEvents) => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    console.log("수정된 일정: ", updatedEvent);
  };

  const formatTime = (time, start, end) => {
    if (!time) {
      return ''; // time이 유효하지 않으면 빈 문자열 반환
    }

    // LocalTime 객체를 Date 객체로 변환
    const [hours, minutes] = time.split(":").map((val) => parseInt(val, 10));
    const date = new Date();
  
    // hours가 24 이상이면 날짜를 초과한 시간일 수 있으므로, 24시간 포맷을 처리
    date.setHours(hours % 24, minutes, 0);
  
    return date.toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,  // 12시간 형식 (오전/오후 표시)
    });
  }

   // 체크박스 클릭 시 완료 상태 토글
   const handleCheckboxToggle = (eventId) => {
    setCompletedEvents((prev) => {
      if (prev.has(eventId)) {
        prev.delete(eventId); // 체크 해제
      } else {
        prev.add(eventId); // 체크 완료
      }
      return new Set(prev);
    });
  };

   // 일정 색상 설정 함수
   const getEventColor = (projectId) => {
    if (!projectId) return "#ccdcf4"; // 개인 일정은 노란색
    const hash = Array.from(projectId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [ "#ff8469", "#6f8afe", "#ff81c9", "#f5fc7c", "#ffa865", "#b67eff", "#88f8b9"];
    return colors[hash % colors.length]; // 같은 projectId는 같은 색 유지
  };
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
              <Checkbox
                  checked={completedEvents.has(event.id)}
                  onChange={() => handleCheckboxToggle(event.id)}
                  color="primary"
                />
              <Card sx={{ width: '100%', marginBottom: 1 }}>
                <CardContent>
                  <ListItemText
                    primary={event.title}
                    secondary={`${formatTime(event.sTime)} ~ ${formatTime(event.eTime)}`}
                    sx={{
                      textDecoration: completedEvents.has(event.id) ? "line-through" : "none",
                      color: "#000000",
                    }}
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events.map(event => ({
          ...event,
          color: getEventColor(event.projectId),
          textColor: "#000000", // 글자 색상 통일
          borderColor: getEventColor(event.projectId), // 테두리 제거
        }))}
        timeZone="Asia/Seoul"
        firstDay={0}
        weekends={true}
        eventTextColor="#000000"
        eventClick={handleEventClick}
      />
      {isAddModalOpen && (
        <AddSchedule
          userId={userId}
          selectedDate={selectedDate}
          anchorEl={anchorEl}
          onClose={() => setIsAddModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}

      {isUpdateModalOpen && selectedEvent && (
        <UpdateSchedule
          calendarId={selectedEvent.id}
          selectedEvent={selectedEvent}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateEvent={handleUpdateEvent}
        />
        )}
    </div>
  </div>
);
};


export default MyCalendar;
