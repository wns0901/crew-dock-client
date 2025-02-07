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
  const [selectedIssues, setSelectedIssues] = useState([]);
  const {userInfo} = useContext(LoginContext);
  
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
        console.log("이슈 목록:", response.data)
        console.log("프로젝트 ID:", projectId)
        console.log("현재 로그인한 userInfo:", userInfo)
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
    setSelectedIssues((prev) =>
      prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIssues(issues.map((issue) => issue.id));
    } else {
      setSelectedIssues([]);
    }
  };

  const handleDeleteIssues = () => {
    if (selectedIssues.length === 0) return;
    if (!window.confirm("선택한 이슈를 삭제하시겠습니까?")) return;

    axios.delete(`http://localhost:8081/projects/${projectId}/issues`, {
      data: selectedIssues
    })
    .then(() => {
      alert("삭제 완료");
      setSelectedIssues([]);
      fetchIssues();
    })
    .catch(error => console.error("이슈 삭제 실패:", error));
  };

  return (
    <div>
      <TableContainer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
          <h2>이슈 관리</h2>
          <IconButton onClick={handleDeleteIssues} disabled={selectedIssues.length === 0}>
            <Delete />
          </IconButton>
        </div>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={selectedIssues.length > 0 && selectedIssues.length < issues.length}
                  checked={issues.length > 0 && selectedIssues.length === issues.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>작업명</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>우선순위</TableCell>
              <TableCell>타임라인</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} style={{ cursor: "pointer" }}>
                <TableCell>
                  <Checkbox
                    checked={selectedIssues.includes(issue.id)}
                    onChange={() => handleSelectIssue(issue.id)}
                  />
                </TableCell>
                <TableCell onClick={() => handleOpenModal(issue)} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {issue.issueName}
                </TableCell>
                <TableCell>{issue.manager?.nickname || '담당자 정보 없음'}</TableCell>
                <TableCell>
                  <Chip label={issue.status} color={statusColors[issue.status] || "default"} />
                </TableCell>
                <TableCell>
                  <Chip label={issue.priority} color={priorityColors[issue.priority] || "default"} />
                </TableCell>
                <TableCell>{issue.startline} ~ {issue.deadline}</TableCell>
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
