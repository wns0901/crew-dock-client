import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PendingMembers = () => {
  const { projectId } = useParams();
  const { projectRoles } = useContext(LoginContext); // 로그인 컨텍스트에서 프로젝트 권한 정보 가져오기

  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchPendingMembers();
    }
  }, [projectId]);

  const fetchPendingMembers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/projects/${projectId}/members`);
      console.log("API 응답 데이터:", response.data);

      const filteredMembers = response.data.filter((member) => member.status === "REQUEST");
      setPendingMembers(filteredMembers);
    } catch (error) {
      console.error("가입 신청 유저 조회 실패:", error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`${BASE_URL}/projects/${projectId}/members`, {
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
      await axios.patch(`${BASE_URL}/projects/${projectId}/members`, {
        userId: userId,
        status: "WITHDRAW",
      });
      alert("거절 완료");
      fetchPendingMembers();
    } catch (error) {
      console.error("거절 요청 실패:", error);
    }
  };

  // 현재 로그인한 사용자가 이 프로젝트의 캡틴인지 확인
  const isCaptain = projectRoles.some(
    (role) => role.projectId === parseInt(projectId) && role.role.isCaptain
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        가입 신청 목록
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>닉네임</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>포지션</TableCell>
              {isCaptain && <TableCell></TableCell>}
              {isCaptain && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
  {pendingMembers.length > 0 ? (
    pendingMembers.map((member) => (
      <TableRow key={member.id}>
        <TableCell>
        <Link
    to={`/mypage/${member.id}`}
    style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}  >
          {member.user.nickname}
          </Link>
          </TableCell>
        <TableCell>{member.user.phoneNumber}</TableCell>
        <TableCell>{member.position}</TableCell>
        {isCaptain && (
          <TableCell>
            <Box display="flex" gap={1}> {/* 버튼 사이 간격 조절 */}
              <Button variant="contained" color="primary" size="small" onClick={() => handleApprove(member.user.id)}>
                승인
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleReject(member.user.id)}>
                거절
              </Button>
            </Box>
          </TableCell>
        )}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={isCaptain ? 4 : 3} align="center">
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
