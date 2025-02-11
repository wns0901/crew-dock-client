import React, { useState, useEffect, useContext, useNavigate } from "react";
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Box, TableContainer, Checkbox, Chip, IconButton } from "@mui/material";
import { Delete } from '@mui/icons-material';
import IssueWriteModal from "./IssueWriteModal";
import IssueUpdateModal from "./IssueUpdateModal";
import axios from "axios";
import dayjs from "dayjs";
import api from "../../../apis/baseApi";

const IssueTable = () => {
  const projectId = 1;
  // const projectId = useParams();
  const [issues, setIssues] = useState([]); // 추가된 이슈
  const [openUpdateModal, setopenUpdateModal] = useState(false);  
  const [selectedIssue, setSelectedIssue] = useState(null); // 선택된 이슈
  const [openWriteModal, setOpenWriteModal] = useState(false); // 작성 모달
  const [checkItems, setCheckItems] = useState([]) // 이슈 체크 상태
  const [allChecked, setAllChecked] = useState(false); // 전체 선택 상태
  const { userInfo } = useContext(LoginContext);
  
// 상태에 따른 색상
  const statusColors = {
    INPROGRESS: "warning",
    YET: "info",
    COMPLETE: "success",
  };

  // 우선순위에 따른 색상
  const priorityColors = {
    HIGH: "error",
    MIDDLE: "primary",
    LOW: "success",
  };

  // 모든 이슈 불러오기
useEffect(() => {
  if(!projectId) return;
  console.log("projectId:", projectId);

  const fetchIssueData = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/issues`);
      console.log(response.data);
     // 데이터 구조가 일치하는지 확인
      const issues = response.data.map(issue => ({
        writerId: issue.writerId,
        writerName: issue.writerName,
        managerId: issue.managerId,
        managerName: issue.managerName,
        projectId: issue.projectId,
        issueId: issue.issueId,
        issueName: issue.issueName,
        priority: issue.priority,
        status: issue.status,
        deadline: dayjs(issue.deadline).format("YYYY-MM-DD"),
        startline: dayjs(issue.startline).format("YYYY-MM-DD"),
        createAt: dayjs(issue.createAt).format("YYYY-MM-DD HH:mm")
      }));
      setIssues(issues);

      setIssues(response.data); // 가져온 데이터를 상태에 설정
    } catch (error) {
      console.error("프로젝트 이슈를 가져오는데 실패했습니다.", error);
      // 사용자에게 친절한 메시지 제공
      alert("이슈 데이터를 가져오는 데 실패했습니다. 서버 상태를 확인해 주세요.");
    }
  }
  fetchIssueData();
},[projectId]);

 // 타임라인, 상태 색상 결정 함수
 const getTimelineColor = (startline, deadline, status) => {
  const currentDate = dayjs();
  const startDate = dayjs(startline);
  const endDate = dayjs(deadline);
  // 타임라인 마감일이 지났고, 상태가 완료가 아닌 경우 빨간색
  if (currentDate.isAfter(endDate) && status !== 'COMPLETE') {
    return 'error'; // 빨간색
  }
  // 타임라인 마감일이 지나지 않았고, 상태가 완료인 경우 초록색
  if (currentDate.isBefore(endDate) && status === 'COMPLETE') {
    return 'success'; // 초록색
  }
  // 타임라인 시작일이 오늘 날짜 전일 경우 회색 (default)
  if (startDate.isBefore(currentDate)) {
    return 'default'; // 회색
  }
  return 'default'; // 기본값은 회색
};

// 수정 모달 열기
const handleOpenUpdateModal = (issue) => {
  setSelectedIssue(issue);
  setopenUpdateModal(true);
};

// 수정 모달 닫기
  const handleCloseUpdateModal = () => {
    setopenUpdateModal(false);
    setSelectedIssue(null);
    fetchIssueData();
  };

// 작성 모달 열기
  const handleOpenWriteModal = () => {
    setOpenWriteModal(true);
  };

  // 작성 모달 닫기
  const handleCloseWriteModal = () => {
    setOpenWriteModal(false);
    fetchIssueData();
  };


// 개별 체크박스 선택 처리
const checkItemHandler = (issueId, isChecked) => {
  setCheckItems((prev) => {
    if (isChecked) {
      return [...prev, issueId]; // 체크 시, ID 추가
    } else {
      return prev.filter((item) => item !== issueId); // 체크 해제 시, ID 제거
    }
  });
};

// 전체 선택 처리
const allCheckedHandler = (e) => {
  const isChecked = e.target.checked;
  setAllChecked(isChecked);
  if (isChecked) {
    setCheckItems(issues.map((item) => item.issueId)); // 모든 이슈 ID 선택
  } else {
    setCheckItems([]); // 선택된 항목 초기화
  }
};

  useEffect(() => {
    if (checkItems.length === issues.length) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [checkItems, issues.length]);

  // 삭제 핸들러
  const handleDelete = () => {
    if (checkItems.length === 0) {
      alert("삭제할 이슈를 선택하세요.");
      return;
    }
  
    const confirmMessage = checkItems.length > 1
      ? `${checkItems.length}개의 이슈를 삭제하시겠습니까?`
      : "해당 이슈를 삭제하시겠습니까?";
  
    if (checkItems.length > 1) {
      // 다중 삭제
      if (window.confirm(confirmMessage)) {
        const deleteUrl = `http://localhost:8081/projects/${projectId}/issues`;
        
        // 쿼리 파라미터로 전달
        const urlWithParams = `${deleteUrl}?issueIds=${checkItems.join("&issueIds=")}`;
        axios.delete(urlWithParams)
          .then(() => {
            fetchIssueData();
            alert("삭제되었습니다.");
          })
          .catch((error) => console.error("이슈 삭제 실패:", error));
      }
    } else {
      // 개별 삭제
      if (window.confirm(confirmMessage)) {
        const issueId = checkItems[0]; // 개별 이슈 ID 가져오기
        axios.delete(`http://localhost:8081/projects/${projectId}/issues/${issueId}`)
          .then(() => {
            fetchIssueData();
            alert("삭제되었습니다.");
          })
          .catch((error) => console.error("이슈 삭제 실패:", error));
      }
    }
  };
  

  return (
    <div>
      <TableContainer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
          <h2>이슈 관리</h2>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </div>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>
                <Checkbox
                  onChange={allCheckedHandler} checked={allChecked}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>작업명</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>담당자</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>상태</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>우선순위</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>타임라인</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.issueId} style={{ cursor: "pointer" }}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Checkbox
                      value={issue.issueId}
                      checked={checkItems.includes(issue.issueId)}  // 체크 상태 확인
                      onChange={(e) =>
                        checkItemHandler(issue.issueId, e.target.checked) // 개별 선택 처리
                      }
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => handleOpenUpdateModal(issue)}>
                  {issue.issueName}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{issue.managerName || '닉네임 정보 없음'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={issue.status} color={statusColors[issue.status] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={issue.priority} color={priorityColors[issue.priority] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={`${issue.startline} ~ ${issue.deadline}`} color={getTimelineColor(issue.startline, issue.deadline, issue.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" onClick={handleOpenWriteModal} sx={{ margin: "10px" }}>
          + 작업 추가
        </Button>
      </TableContainer>

      <Modal open={openWriteModal} onClose={handleCloseWriteModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <IssueWriteModal projectId={projectId} onClose={handleCloseWriteModal} />
        </Box>
      </Modal>

      <Modal open={openUpdateModal} onClose={handleCloseUpdateModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          {selectedIssue && (
            <IssueUpdateModal projectId={projectId} issue={selectedIssue} onClose={handleCloseUpdateModal} />
          )}I
        </Box>
      </Modal>
    </div>
  );
};

export default IssueTable;
