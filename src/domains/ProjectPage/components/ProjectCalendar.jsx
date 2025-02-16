import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Divider, Box, List, ListItem, Card, CardContent, ListItemText, Checkbox, Typography } from '@mui/material';
import api from '../../../apis/baseApi';
import AddProjectSchedule from './AddProjectSchedule';
import UpdateProjectSchedule from './UpdateProjectSchedule';
import styles from "../FullCalendar.module.css";
import { useParams } from 'react-router-dom';

const ProjectCalendar = ({}) => {
  const {projectId} = useParams();
  const [events, setEvents] = useState([]); // 프로젝트 일정 데이터 저장 상태
  const [isHoliday, setIsHoliday] = useState(); // 공휴일 데이터를 저장할 상태
  const [todays, setTodayEvents] = useState([]); // 오늘의 팀 일정 데이터 저장 상태
  const [completedEvents, setCompletedEvents] = useState(new Set()); // 체크된 일정 ID 저장
  const {userInfo, projectRoles} = useContext(LoginContext);
  // const {userId, setUserId} = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 일정 데이터 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 일정 추가 모달 상태
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태
  const [selectedEvent, setSelectedEvent] = useState(null); // 수정할 이벤트 상태
  const [anchorEl, setAnchorEl] = useState();
  const [calendarId, setCalendarId] = useState(null);  // 수정할 일정 ID 저장
  const [currentMonth, setCurrentMonth] = useState(null); //  현재 월 정보 저장
  

  // 로그인한 유저
  useEffect(() => {
    if (userInfo?.id) {
      // setUserId(userInfo.id);
      console.log("userId:", userInfo.id);
      // userId = userInfo.id;
      
    }
  }, [userInfo]);
  

  // 특정 프로젝트 ID에 해당하는 일정만 가져오기
  useEffect(() => {
    console.log(projectId);
    if (!projectId) return;

    const fetchProjectCalendarData = async () => {
      try {
        // /calendars/project?projectId=1
        const response = await api.get(`/calendars/project?projectId=${projectId}`);
        console.log(response.data);
        
        if (Array.isArray(response.data)) {
          // 프로젝트 ID 필터링
          const formattedEvents = response.data.filter(event => event.projectId !== null).map (event => {
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
              isHoliday: event.holiday
            };
          });

          // 공휴일만 따로 필터링
          const holidays = formattedEvents.filter(event => event.isHoliday === true);
          console.log("holidays", holidays);

          setIsHoliday(holidays);

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
            setEvents(formattedEvents);
            console.log(formattedEvents);

            
          setTodayEvents(todaysEvents); // 오늘 일정만 따로 저장
        } else {
          console.error('유효한 JSON 데이터가 아닙니다.');
        }
      } catch (error) {
        console.error("Failed to fetch calendar events", error);
      }
    };

    fetchProjectCalendarData();
  }, [projectId]);

  // 날짜 클릭 시 일정 추가 모달 열기
  const handleDateSelect = (info) => {
    setSelectedDate(info.startStr);
    console.log("Select Date: ", info.startStr);
    setIsAddModalOpen(true); // 날짜 클릭 시 일정 추가 모달 열기
  };

  // FullCalendar의 월이 변경될 때 currentMonth 업데이트
  const handleMonthChange = (info) => {
    setCurrentMonth(info.view.title);  // 현재 월 정보를 상태에 저장
    console.log("Current Month:", info.view.title);
  };

  // 일정 수정 모달창
  const handleUpdateEvent = (event) => {
    console.log("Clicked Event: ", event);
    const eventId2 = event.event.id;  // 캘린더 이벤트 ID
    setSelectedEvent(eventId2);
    setCalendarId(eventId2);  // 캘린더 ID 설정

    setTimeout(() => {
      setIsUpdateModalOpen(true);
    }, 0);
  }

  // 일정 수정 후 상태 업데이트
  const handleUpdateEventData = (updateEvent) => {
    const newEvent = {
      id: updateEvent.id,
      title: updateEvent.content,
      start: updateEvent.startDate,
      end: updateEvent.endDate,
      sTime: updateEvent.startTime,
      eTime: updateEvent.endTime,
      projectId: updateEvent.projectId,
      isHoliday: updateEvent.holiday || false
    };
  
    setEvents(prev => [newEvent, ...prev]);
  
    const today = new Date();
    const eventStartDate = new Date(newEvent.start);
    const eventEndDate = new Date(newEvent.end);
  
    if (
      eventStartDate.toDateString() === today.toDateString() ||
      (eventStartDate <= today && eventEndDate >= today)
    ) {
      setTodayEvents(prev => [newEvent, ...prev]);
    }
  };

  // 삭제된 일정 제거
  const handleDeleteEvent = (calendarId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== calendarId));
  };

  // 일정 추가 후 상태 업데이트 
  const onAddSchedule = (data) => {
    const newEvent = {
      id: data.id,
      title: data.content,
      start: data.startDate,
      end: data.endDate,
      sTime: data.startTime,
      eTime: data.endTime,
      projectId: data.projectId,
      isHoliday: data.holiday || false
    };
  
    setEvents(prev => [newEvent, ...prev]);
  
    const today = new Date();
    const eventStartDate = new Date(newEvent.start);
    const eventEndDate = new Date(newEvent.end);
  
    if (
      eventStartDate.toDateString() === today.toDateString() ||
      (eventStartDate <= today && eventEndDate >= today)
    ) {
      setTodayEvents(prev => [newEvent, ...prev]);
    }
  }

  const formatTime = (time) => {
    if (!time) {
      return ''; 
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

  //  일정 색상 설정 함수
   const getEventColor = (isHoliday) => {    
    if(isHoliday) return "#ff3d3d";
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Today's events section */}
      <Box
        sx={{
          width: '20%', // 1:4 비율로 설정
          marginRight: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 2,
          padding: 2,
        }}
      >
        <h2 style={{ fontSize: "2rem", textAlign: "center", margin: "1rem 0" }}>Todays</h2>
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
                    {/* 제목 */}
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: completedEvents.has(event.id) ? "line-through" : "none",
                        color: "#000000",
                        textAlign: "left",
                        mb: 1.5, // 제목과 날짜 사이 간격 추가
                        fontSize: "17px",
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
                        fontSize: "10px"
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
      <div style={{ flex: 4 }} className={styles.customCalendar}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          events={events}
          eventColor={event => getEventColor(event.isHoliday)}
          datesSet={handleMonthChange}
          timeZone="Asia/Seoul"
          firstDay={0}
          weekends={true}
          eventTextColor="#000000"
          eventClick={handleUpdateEvent}
          locale="ko"
          dayMaxEventRows={2}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next today"
          }}
        />

        {isAddModalOpen && (
          <AddProjectSchedule
            projectId={projectId}
            userId={userInfo.id}
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
          <UpdateProjectSchedule
            projectId={projectId}
            userId={userInfo.id}
            calendarId={calendarId}
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

export default ProjectCalendar;
