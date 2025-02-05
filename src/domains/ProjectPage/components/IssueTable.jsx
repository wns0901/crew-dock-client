import React, { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Box, TableContainer } from "@mui/material";
import IssueModal from "./IssueModal";
import axios from "axios";

const IssueTable = ({ projectId }) => {
  const [issues, setIssues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 이슈 목록 가져오기
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8081/projects/${projectId}/issues"
    })
    .then(response => {
      const {data, status, statusText} = response;
      console.log(data);
      setIssues(data);
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
                <TableCell>{issue.issueName}</TableCell>
                <TableCell>{issue.manager.username}</TableCell>
                <TableCell>{issue.status}</TableCell>
                <TableCell>{issue.priority}</TableCell>
                <TableCell>{issue.startline} ~ {issue.deadline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Button variant="contained" onClick={() => handleOpenModal()}>+ 이슈 추가</Button>
        </TableFooter>
      </TableContainer>

      {/* 모달창 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: 600, margin: "auto", mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <IssueModal projectId={projectId} issue={selectedIssue} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
};