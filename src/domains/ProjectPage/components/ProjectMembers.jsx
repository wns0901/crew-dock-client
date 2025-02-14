import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ProjectMembers = () => {
  const { projectId } = useParams();
  const { userInfo, projectRoles } = useContext(LoginContext); // user → userInfo로 변경
  const [members, setMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [resignation, setResignation] = useState("");

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/projects/${projectId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error("멤버 조회 실패:", error);
    }
  };

  const handleOpenModal = (member) => {
    if (member.authority === "CAPTAIN") {
      alert("프로젝트장은 탈퇴할 수 없습니다.");
      return;
    }
    setSelectedMember(member);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setResignation("");
    setOpenModal(false);
  };

  const handleAuthority = async (userId) => {
    try {
      await axios.patch(`${BASE_URL}/projects/${projectId}/members`, {
        userId: userId,
        authority: "CAPTAIN",
      });

      await axios.patch(`${BASE_URL}/projects/${projectId}/members`, {
        userId: userInfo.id,
        authority: "CREW",
      });

      fetchMembers();
    } catch (error) {
      console.error("권한 변경 오류:", error);
    }
  };

  const handleResignation = async () => {
    if (!selectedMember) {
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/projects/${projectId}/resignations/members`,
        { content: resignation },
        {
          params: { userId: selectedMember.user.id },
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("탈퇴 신청 완료");
      handleCloseModal();
    } catch (error) {
      console.error("탈퇴 신청 오류:", error);
    }
  };

  // 현재 로그인한 사용자가 CAPTAIN인지 확인
  const isCaptain = projectRoles.some(
    (role) => role.projectId === parseInt(projectId) && role.role.isCaptain // 여기 수정
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        프로젝트 멤버 목록
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>권한</TableCell>
              <TableCell>닉네임</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>포지션</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(members) &&
              members
                .filter((member) => member.status === "APPROVE")
                .map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.authority}</TableCell>
                    <TableCell>
                    <Link
    to={`/mypage/${member.id}`}
    style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
  >
                      {member.user.nickname}
                      </Link>
                      </TableCell>
                    <TableCell>{member.user.phoneNumber}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
  <Box display="flex" gap={1}>
    {/* 현재 로그인한 유저의 정보일 때만 탈퇴 버튼 표시 */}
    {userInfo.id === member.user.id && (
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleOpenModal(member)}
      >
        탈퇴
      </Button>
    )}

    {/* 현재 사용자가 CAPTAIN이고, 해당 멤버가 CAPTAIN이 아닐 때만 위임 버튼 표시 */}
    {isCaptain && member.authority !== "CAPTAIN" && (
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => handleAuthority(member.user.id)}
      >
        위임
      </Button>
    )}
  </Box>
</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 탈퇴 사유 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            {selectedMember?.user.name}님을 탈퇴시키시겠습니까?
          </Typography>
          <TextField
            fullWidth
            label="탈퇴 사유"
            multiline
            rows={3}
            value={resignation}
            onChange={(e) => setResignation(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleResignation}
            >
              확인
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectMembers;
