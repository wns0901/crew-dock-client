import React, { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Resignations = () => {
  const [resignations, setResignations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      fetchResignations(projectId);
    }
  }, [projectId]);

  const fetchResignations = async (projectId) => {
    try {
      console.log("Fetching resignations for projectId:", projectId);
      const response = await axios.get(
        `${BASE_URL}/projects/${projectId}/resignations`
      );
      setResignations(response.data.filter((resignation) => resignation.member.status === "APPROVE"));
    } catch (error) {
      console.error("탈퇴 조회 실패:", error);
    }
  };

  const handleOpenModal = async (resignationId) => {
    try {
      console.log("Fetching resignation details:", resignationId);
      const response = await axios.get(
        `${BASE_URL}/projects/${projectId}/resignations/${resignationId}`
      );
      setSelectedResignation(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("탈퇴 상세 조회 실패:", error);
    }
  };

  const handleAcceptResignation = async (resignationId, userId) => {
    try {
      await axios.delete(
        `${BASE_URL}/projects/${projectId}/members/${userId}`
      );
      alert("탈퇴 처리 완료.");
      handleCloseModal();
      fetchResignations(projectId);
    } catch (error) {
      console.error("탈퇴 처리 실패:", error);
      alert("탈퇴 처리 중 오류 발생");
    }
  };

  const handleRejectResignation = async (resignationId) => {
    try {
      await axios.delete(
        `${BASE_URL}/projects/${projectId}/resignations/${resignationId}`
      );
      alert("탈퇴 신청 거절 완료");
      handleCloseModal();
      fetchResignations(projectId);
    } catch (error) {
      console.error("탈퇴 신청 거절 실패:", error);
      alert("탈퇴 신청 거절 중 오류 발생");
    }
  };

  const handleCloseModal = () => {
    setSelectedResignation(null);
    setOpenModal(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5">탈퇴 요청</Typography>
     
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>닉네임</TableCell>
              <TableCell>사유</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resignations.map((resignation) => (
              <TableRow
                key={resignation.id}
                onClick={() => handleOpenModal(resignation.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{resignation.member?.user?.nickname || "알 수 없음"}</TableCell>
                <TableCell>
                  {(() => {
                    try {
                      const parsedContent = JSON.parse(resignation.content);
                      return parsedContent.content.length > 30
                        ? `${parsedContent.content.substring(0, 30)}...`
                        : parsedContent.content;
                    } catch (error) {
                      console.error("JSON 파싱 오류:", error);
                      return "내용 없음";
                    }
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Typography variant="h6">
            {selectedResignation?.member?.user?.nickname || "알 수 없음"}님의 탈퇴 사유
          </Typography>
          <Typography mb={3}>
            {(() => {
              try {
                const parsedContent = JSON.parse(selectedResignation?.content || "{}");
                return parsedContent.content || "사유 없음";
              } catch (error) {
                console.error("JSON 파싱 오류:", error);
                return "사유 없음";
              }
            })()}
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseModal}>
              닫기
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() =>
                handleAcceptResignation(
                  selectedResignation?.id,
                  selectedResignation?.member?.id
                )
              }
            >
              수락
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 2 }}
              onClick={() => handleRejectResignation(selectedResignation?.id)}
            >
              거절
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Resignations;
