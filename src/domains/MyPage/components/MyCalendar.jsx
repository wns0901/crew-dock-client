import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddSchedule from './AddSchedule';
import UpdateSchedule from './UpdateSchedule';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Divider, Box, List, ListItem, Card, CardContent, ListItemText, Checkbox, Typography } from '@mui/material';
import api from '../../../apis/baseApi';
import styles from "../FullCalendar.module.css";

const MyCalendar = ({}) => {
  const [events, setEvents] = useState([]); // 추가된 일정 데이터 저장할 상태
  const [holidays, setHolidays] = useState([]); // 공휴일 데이터를 저장할 상태
  const [todays, setTodayEvents] = useState([]); // 오늘의 일정 데이터 저장할 상태
  const [completedEvents, setCompletedEvents] = useState(new Set()); // 체크된 일정 ID 저장
  const {userInfo, projectRoles} = useContext(LoginContext);
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 일정 데이터 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 일정 추가 모달 상태
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태
  const [selectedEvent, setSelectedEvent] = useState(null); // 수정할 이벤트 상태
  const [anchorEl, setAnchorEl] = useState();
  const [userId, setUserId] = useState(null);
  const [calendarId, setCalendarId] = useState(null);  // 수정할 일정 ID 저장

  // 로그인한 유저 ID
  useEffect(() => {
    if (userInfo?.id) {
      setUserId(userInfo.id);
      console.log(userInfo.id);
      
    }
  }, [userInfo]);

  const projectIds = Array.isArray(projectRoles)
  ? projectRoles.map(role => role.projectId)
  : [];
  // console.log("현재 본인이 속한 팀 id: ", projectIds);
  

  // 모든 일정 가져오기
  useEffect(() => {
    if (!userId) return;
  
    const fetchCalendarData = async () => {
      try {
        const response = await api.get(`/calendars?userId=${userId}&projectIds=${projectIds.join(',')}`);
  
        if (Array.isArray(response.data)) {
          const formattedEvents = response.data.map(event => {
            
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

             // 한국 시간으로 변환 (UTC +9)
            const koreaOffset = 9 * 60; // 한국은 UTC+9
            startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset() + koreaOffset);
            endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset() + koreaOffset);

            // 시간 설정: startTime과 endTime이 있다면 날짜에 시간을 더해줍니다.
            if (event.startTime) {
              const [startHour, startMinute] = event.startTime.split(":");
              startDate.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));  // 숫자로 변환 후 setHours 호출
            }

            if (event.endTime) {
              const [endHour, endMinute] = event.endTime.split(":");
              endDate.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));  // 숫자로 변환 후 setHours 호출
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
        } else {
          console.error('유효한 JSON 데이터가 아닙니다.');
        }
      } catch (error) {
        console.error("Failed to fetch calendar events", error);
      }
    };
  
    fetchCalendarData();
  }, [userId, projectIds]);

  const handleDateSelect = (info) => {
    setSelectedDate(info.startStr);
    console.log("Select Date: ", info.startStr);
    setIsAddModalOpen(true); // 날짜 클릭 시 일정 추가 모달 열기
  };

  // 일정 수정 모달창
  const handleUpdateEvent = (event) => {
    console.log("Clicked Event: ", event);
    const eventId2 = event.event.id;  // 캘린더 이벤트 ID
    setSelectedEvent(eventId2);
    setCalendarId(eventId2);  // 캘린더 ID 설정
    setIsUpdateModalOpen(true); 
    console.log("Updated selectedEvent:", eventId2);
    console.log("Modal Open:", isUpdateModalOpen);
  }

  // 일정 수정 후 상태 업데이트
  const handleUpdateEventData = (updateEvent) => {
    setEvents((events) => 
      events.map((event) => (event.id === updateEvent.id ? updateEvent : event))
    )
  }

  // 삭제된 일정 제거
  const handleDeleteEvent = (calendarId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== calendarId));
  };

  // 일정 추가 후 상태 업데이트 
  const onAddSchedule = (data) => {
    setEvents(prev => [data, ...prev]);
  }

  const formatTime = (time) => {
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
    <h2 style={{ fontSize: "2rem", textAlign: "center", margin: "1rem 0" }}>Todays</h2>      <Divider sx={{ marginBottom: 2 }} />
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
                 {/* 제목 */}
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: completedEvents.has(event.id) ? "line-through" : "none",
                    color: "#000000",
                    textAlign: "left",
                    mb: 2, // 제목과 날짜 사이 간격 추가
                    fontSize: "20px",
                  }}
                >
                  {event.title}
                </Typography>

                {/* 날짜 및 시간 */}
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "right",
                    color: "gray",
                    fontSize: "12px"
                  }}
                >
                  {`${event.start} ${formatTime(event.sTime)} ~ ${event.end} ${formatTime(event.eTime)}`}
                </Typography>
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
    <div style={{ flex: 3 }} className={styles.customCalendar}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events.map(event => ({
          ...event,
          color: getEventColor(event.projectId)
        }))}
        timeZone="Asia/Seoul"
        firstDay={0}
        weekends={true}
        eventTextColor="#000000"
        eventClick={handleUpdateEvent}
        locale="ko"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next today"
        }}
      />
      
      {isAddModalOpen && (
        <AddSchedule
          userId={userId}
          selectedDate={selectedDate}
          onClose={() => setIsAddModalOpen(false)}
          events={events}
          setEvents={setEvents}
          todays={todays}
          setTodays={setTodayEvents}
          onAddSchedule={onAddSchedule}
          anchorEl={anchorEl}
        />
      )}

      {isUpdateModalOpen && selectedEvent && (
        <UpdateSchedule
          userId={userId}
          calendarId={calendarId}
          projectId={projectIds}
          selectedEvent={selectedEvent}
          onUpdateEvent={handleUpdateEventData}
          onDeleteEvent={handleDeleteEvent}
          anchorEl={anchorEl}
          onClose={() => setIsUpdateModalOpen(false)}
          events={events}
          setEvents={setEvents}
          todays={todays}
          setTodays={setTodayEvents}
        />
        )}
    </div>
  </div>
);
};


export default MyCalendar;

