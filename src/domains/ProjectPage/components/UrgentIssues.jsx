import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography } from "@mui/material";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 상태 & 우선순위 한글 변환 매핑
const reverseStatusMap = {
  INPROGRESS: "진행중",
  COMPLETE: "완료",
  YET: "시작안함",
};

const reversePriorityMap = {
  HIGH: "높음",
  MIDDLE: "중간",
  LOW: "낮음",
};

// 상태에 따른 색상 지정
const statusColors = {
  INPROGRESS: "primary",
  COMPLETE: "success",
  YET: "warning",
};

// 우선순위에 따른 색상 지정
const priorityColors = {
  HIGH: "error",
  MIDDLE: "warning",
  LOW: "success",
};

const UrgentIssues = () => {
  const { projectId } = useParams();
  const [urgentIssues, setUrgentIssues] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchIssues = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/projects/${projectId}/issues`);
        const issues = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedIssues = issues
          .map(issue => ({
            ...issue,
            deadline: new Date(issue.deadline)
          }))
          .filter(issue => issue.deadline >= today)
          .sort((a, b) => a.deadline - b.deadline)
          .slice(0, 3);

        setUrgentIssues(sortedIssues);
      } catch (error) {
        console.error("이슈 목록 가져오기 실패:", error);
      }
    };

    fetchIssues();
  }, [projectId]);

  return (
    <TableContainer sx={{ mt: 3 }}>
   <h2 style={{ textAlign: "center", marginBottom: "20px" }}> ⏳ 마감 임박 일정</h2>

      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ textAlign: "center" }}>작업명</TableCell>
            <TableCell sx={{ textAlign: "center" }}>담당자</TableCell>
            <TableCell sx={{ textAlign: "center" }}>상태</TableCell>
            <TableCell sx={{ textAlign: "center" }}>우선순위</TableCell>
            <TableCell sx={{ textAlign: "center" }}>타임라인</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urgentIssues.length > 0 ? (
            urgentIssues.map(issue => (
              <TableRow key={issue.id} style={{ cursor: "pointer" }}>
                <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {issue.issueName}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{issue.managerName || "닉네임 정보 없음"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip label={reverseStatusMap[issue.status] || issue.status} color={statusColors[issue.status] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip label={reversePriorityMap[issue.priority] || issue.priority} color={priorityColors[issue.priority] || "default"} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip label={`${issue.startline} ~ ${issue.deadline.toISOString().split("T")[0]}`} color="default" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center", color: "gray" }}>
                현재 임박한 이슈가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UrgentIssues;
