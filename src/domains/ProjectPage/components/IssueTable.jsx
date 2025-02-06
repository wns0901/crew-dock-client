import React, { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Box, TableContainer } from "@mui/material";
import IssueWriteModal from "./IssueWriteModal";  // IssueWriteModal 추가
import IssueUpdateModal from "./IssueUpdateModal"; // IssueUpdateModal 추가
import axios from "axios";

const IssueTable = () => {
  // 하드 코딩
  const projectId = 1; // 프로젝트 ID
  const userId = 1;    // 로그인한 유저 ID

  const [issues, setIssues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openWriteModal, setOpenWriteModal] = useState(false); // 추가용 모달 상태

  // 상태와 우선순위를 영어로 전달하기 위한 매핑
  const statusMap = {
    INPROGRESS: "진행중",
    YET: "시작 안함",
    COMPLETE: "완료",
  };

  const priorityMap = {
    HIGH: "높음",
    MIDDLE: "중간",
    LOW: "낮음",
  };

  // 이슈 목록 가져오기
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8081/projects/${projectId}/issues` // 프로젝트 ID만 전달
    })
    .then(response => {
      setIssues(response.data);
    })
    .catch(error => {
      console.error("이슈 목록을 불러오는 중 오류 발생:", error);
    });
  }, [projectId]);

  // 모달 열기 (추가 또는 수정)
  const handleOpenModal = (issue = null) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIssue(null);
  };

  // IssueWriteModal 열기
  const handleOpenWriteModal = () => {
    setOpenWriteModal(true);
  };

  // IssueWriteModal 닫기
  const handleCloseWriteModal = () => {
    setOpenWriteModal(false);
  };

  // 한국어로 출력할 우선순위와 상태 변환
  const getStatusLabel = (status) => statusMap[status] || status;
  const getPriorityLabel = (priority) => priorityMap[priority] || priority;

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>작업명</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>우선순위</TableCell>
              <TableCell>타임라인</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} onClick={() => handleOpenModal(issue)} style={{ cursor: "pointer" }}>
                <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {issue.issueName}
                </TableCell>
                <TableCell>{issue.manager?.nickname || '담당자 정보 없음'}</TableCell>
                <TableCell>{getStatusLabel(issue.status)}</TableCell>
                <TableCell>{getPriorityLabel(issue.priority)}</TableCell>
                <TableCell>{issue.startline} ~ {issue.deadline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" onClick={handleOpenWriteModal}>+ 이슈 추가</Button>
      </TableContainer>

      {/* 이슈 추가 모달 */}
      <Modal open={openWriteModal} onClose={handleCloseWriteModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <IssueWriteModal projectId={projectId} onClose={handleCloseWriteModal} />
        </Box>
      </Modal>

      {/* 이슈 수정 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <IssueUpdateModal projectId={projectId} issue={selectedIssue} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default IssueTable;
