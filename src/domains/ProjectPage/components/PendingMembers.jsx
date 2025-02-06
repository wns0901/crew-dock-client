import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const PendingMembers = () => {
  const { projectId } = useParams();
  console.log("프로젝트 ID:", projectId);
  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchPendingMembers();
    }
  }, [projectId]);

  const fetchPendingMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/projects/${projectId}/members`);
      console.log("API 응답 데이터:", response.data);

      // status가 "REQUEST"인 유저만 필터링
      const filteredMembers = response.data.filter((member) => member.status === "REQUEST");

      setPendingMembers(filteredMembers);
    } catch (error) {
      console.error("가입 신청 유저 조회 실패:", error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`http://localhost:8080/projects/${projectId}/members`, {
        userId: userId,
        authority: "CREW",
        status: "APPROVE",
      });
      alert("승인 완료");
      fetchPendingMembers();
    } catch (error) {
      console.error("승인 요청 실패:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`http://localhost:8080/projects/${projectId}/members`, {
        userId: userId,
        status: "WITHDRAW",
      });
      alert("거절 완료");
      fetchPendingMembers();
    } catch (error) {
      console.error("거절 요청 실패:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        가입 신청 목록
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>포지션</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingMembers.length > 0 ? (
              pendingMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.user.name}</TableCell>
                  <TableCell>{member.user.phoneNumber}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleApprove(member.user.id)}>
                      승인
                    </Button>
                    <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleReject(member.user.id)}>
                      거절
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  가입 신청한 유저가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PendingMembers;
