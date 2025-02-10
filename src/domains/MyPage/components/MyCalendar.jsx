import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AddSchedule from './AddSchedule';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Divider, Box, List, ListItem, Card, CardContent, ListItemText } from '@mui/material';

const MyCalendar = ({}) => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]); // 공휴일 데이터를 저장할 상태
  const [todays, setTodayEvents] = useState([]); // 오늘의 일정 데이터 저장할 상태
  const {userInfo, projectRoles} = useContext(LoginContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  // 로그인한 유저 ID
  const userId = userInfo?.id;

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
            // startTime과 endTime이 있다면, 이를 start와 end에 추가
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
              projectId: event.projectId,
              isHoliday: event.isHoliday || false,
            };
          });
  
          // 오늘의 일정 필터링
          const today = new Date();
          const todaysEvents = formattedEvents.filter(event => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);
  
            // 오늘이 포함된 일정만 필터링
            return (
              eventStartDate.toDateString() === today.toDateString() ||
              (eventStartDate <= today && eventEndDate >= today)
            );
          });
  
          setEvents(formattedEvents);  // 전체 일정
          setTodayEvents(todaysEvents); // 오늘 일정만 따로 저장
  
          console.log("오늘의 일정: ", todaysEvents);
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
    setIsModalOpen(true);
  };

   // 일정 추가 후, 상태 업데이트 함수
   const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // 동적으로 이벤트 추가
    console.log("새로 추가한 일정: ", setEvents);
  };


  // 해당 일정 클릭 시, AddSchedule.jsx가 열리는 클릭 이벤트 함수
  const openModal = (info) => {
    // 클릭한 이벤트 정보가 담긴 `info`에서 필요한 데이터를 추출
    const selectedEvent = {
      id: info.event.id,
      title: info.event.content, // 일정 내용
      start: info.event.startStr, // 시작 날짜
      end: info.event.endStr, // 종료 날짜
    };
  
    // `selectedDate`를 클릭한 일정의 시작 날짜로 설정
    setSelectedDate(info.event.startStr);
  
    // `AddSchedule` 모달을 열기 위해 상태를 업데이트
    setIsModalOpen(true);
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
                    primary={event.title}
                    secondary={`${formatTime(event.startTime)} ~ ${formatTime(event.endTime)}`
                    }
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
