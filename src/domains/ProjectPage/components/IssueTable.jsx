import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Box, TableContainer, Checkbox, Chip, IconButton } from "@mui/material";
import { Delete } from '@mui/icons-material';
import IssueWriteModal from "./IssueWriteModal";
import IssueUpdateModal from "./IssueUpdateModal";
import axios from "axios";

const IssueTable = () => {
  const projectId = 1;
  const [issues, setIssues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState(new Set());
  const { userInfo } = useContext(LoginContext);

  const statusColors = {
    INPROGRESS: "warning",
    YET: "info",
    COMPLETE: "success",
  };

  const priorityColors = {
    HIGH: "error",
    MIDDLE: "primary",
    LOW: "success",
  };

  const fetchIssues = () => {
    axios.get(`http://localhost:8081/projects/${projectId}/issues`)
      .then(response => {
        setIssues(response.data);
        console.log("이슈 목록:", response.data);
        console.log("프로젝트 ID:", projectId);
        console.log("현재 로그인한 userInfo:", userInfo);
      })
      .catch(error => console.error("이슈 목록 불러오기 실패:", error));
  };

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIssue(null);
    fetchIssues();
  };

  const handleOpenWriteModal = () => {
    setOpenWriteModal(true);
  };

  const handleCloseWriteModal = () => {
    setOpenWriteModal(false);
    fetchIssues();
  };

  const handleSelectIssue = (issueId) => {
    if (!issueId || isNaN(issueId)) {
      console.warn("유효하지 않은 issueId:", issueId);
      return;
    }

    setSelectedIssues((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(issueId)) {
        newSelected.delete(issueId);
      } else {
        newSelected.add(issueId);
      }
      console.log("현재 선택된 이슈:", Array.from(newSelected)); // 콘솔 확인
      return newSelected;
    });
  };
  

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIssues(new Set(issues.map(issue => issue.issueId))); // 전체 선택
      console.log("선택된 이슈Id:", event.issueId )
    } else {
      setSelectedIssues(new Set()); // 전체 해제
    }
  };

  const handleDeleteIssues = () => {
  if (selectedIssues.size === 0) return;

  if (!window.confirm(`선택한 ${selectedIssues.size}개의 이슈를 삭제하시겠습니까?`)) return;

  axios.delete(`http://localhost:8081/projects/${projectId}/issues`, {
    data: Array.from(selectedIssues) // 선택된 이슈 ID 배열로 변환하여 요청
  })
  .then(() => {
    alert(`${selectedIssues.size}개의 이슈가 삭제되었습니다.`);
    setSelectedIssues(new Set()); // 선택 초기화
    fetchIssues(); // 데이터 새로고침
  })
  .catch(error => {
    console.error("이슈 삭제 실패:", error);
    alert("이슈 삭제에 실패했습니다.");
  });
};

const handleDeleteIssue = (issueId) => {
  if (!window.confirm("해당 이슈를 삭제하시겠습니까?")) return;

  axios.delete(`http://localhost:8081/projects/${projectId}/issues/${issueId}`)
    .then(() => {
      alert("이슈 삭제 완료");
      setSelectedIssues(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(issueId);
        return newSelected;
      });
      fetchIssues(); // 데이터 새로고침
    })
    .catch(error => {
      console.error("이슈 삭제 실패:", error);
      alert("이슈 삭제에 실패했습니다.");
    });
};
  

  return (
    <div>
      <TableContainer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
          <h2>이슈 관리</h2>
          <IconButton
            onClick={() => {
              if (selectedIssues.size > 1) {
                handleDeleteIssues();
              } else if (selectedIssues.size === 1) {
                const issueId = Array.from(selectedIssues)[0]; // 선택된 issueId 가져오기
                console.log("선택된 issueId: ", issueId);
                handleDeleteIssue(issueId);
              }
            }}
            disabled={selectedIssues.size === 0}
          >
            <Delete />
        </IconButton>
        </div>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>
                <Checkbox
                  indeterminate={selectedIssues.size > 0 && selectedIssues.size < issues.length}
                  checked={issues.length > 0 && selectedIssues.size === issues.length}
                  onChange={handleSelectAll}
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
              <TableRow key={issue.id} style={{ cursor: "pointer" }}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={selectedIssues.has(issue.id)}
                    onChange={() => handleSelectIssue(issue.id)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => handleOpenModal(issue.id)}>
                  {issue.issueName}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{issue.managerName || '닉네임 정보 없음'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={issue.status} color={statusColors[issue.status] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={issue.priority} color={priorityColors[issue.priority] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{issue.startline} ~ {issue.deadline}</TableCell>
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          {selectedIssue && (
            <IssueUpdateModal projectId={projectId} issue={selectedIssue} onClose={handleCloseModal} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default IssueTable;
