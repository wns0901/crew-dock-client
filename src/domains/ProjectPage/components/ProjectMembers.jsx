import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField } from "@mui/material";

const ProjectMembers = () => {
  const { projectId } = useParams();
  console.log("프로젝트 ID:", projectId);
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
        const response = await axios.get(`http://localhost:8080/projects/${projectId}/members`);
        console.log("API 응답 데이터:", response.data); 
        setMembers(response.data);
    } catch (error) {
        console.error("멤버 조회 실패:", error);
    }
};

  const handleOpenModal = (member) => {
    if(member.authority === "CAPTAIN"){
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
      await axios.patch(`http://localhost:8080/projects/${projectId}/members`, {
        userId: userId,
        authority: "CAPTAIN",
      });
      fetchMembers();
    } catch (error) {
      console.error("권한 변경 오류:", error);
    }
  };

  const handleResignation = async () => {
    if (!selectedMember){
      return;
    }
    try{
      await axios.post(
        `http://localhost:8080/projects/${projectId}/resignations/members`,
        {content: resignation},
        {
          params: {userId: selectedMember.user.id},
        headers: {"Content-Type": "application/json"},
        }
      );
      alert("탈퇴 신청 완료");
      handleCloseModal();
    } catch (error) {
      console.error("탈퇴 신청 오류:", error);
    }
  };

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
              <TableCell>이름</TableCell>          
              <TableCell>연락처</TableCell>
              <TableCell>포지션</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(members) && members
            .filter((member) => member.status === "APPROVE")
            .map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.authority}</TableCell>
                <TableCell>{member.user.name}</TableCell>
              
                <TableCell>{member.user.phoneNumber}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleOpenModal(member)}
                  >
                    탈퇴
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => handleAuthority(member.user.id)}
                  >
                    위임
                  </Button>
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
            boxShadow: 24
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
            <Button variant="outlined"
            color='error'
            onClick={handleCloseModal}>
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
