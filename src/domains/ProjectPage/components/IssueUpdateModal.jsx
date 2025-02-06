import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Stack } from "@mui/material";

const IssueUpdateModal = ({ projectId, issue, onClose }) => {
  const [issueName, setIssueName] = useState(issue?.issueName || "");
  const [managerId, setManagerId] = useState(issue?.manager?.id || "");
  const [status, setStatus] = useState(issue?.status || "");
  const [priority, setPriority] = useState(issue?.priority || "");
  const [startDate, setStartDate] = useState(issue?.startline || "");
  const [endDate, setEndDate] = useState(issue?.deadline || "");
  const [managers, setManagers] = useState([]);

  // 프로젝트 멤버버 목록 가져오기
  useEffect(() => {
    fetch(`/projects/${projectId}/members`)
      .then((res) => res.json())
      .then((data) => setManagers(data))
      .catch((error) => console.error("프로젝트 멤버버 불러오기 실패:", error));
  }, [projectId]);

  // 한국어와 영어 값 매핑
  const priorityMap = {
    높음: "HIGH",
    중간: "MIDDLE",
    낮음: "LOW",
  };

  const statusMap = {
    진행중: "INPROGRESS",
    완료: "COMPLETE",
    시작 안함: "YET",
  };

  const handleSubmit = () => {
    if (!issueName || !managerId || !status || !priority || !startDate || !endDate) {
      alert("모든 필수 항목을 입력하세요!");
      return;
    }

    const updatedIssue = {
      issueName,
      managerId,
      status: statusMap[status] || status,
      priority: priorityMap[priority] || priority,
      startline: startDate,
      deadline: endDate,
    };

    fetch(`/projects/${projectId}/issues/${issue.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedIssue),
    })
      .then((res) => {
        if (!res.ok) throw new Error("이슈 수정 실패");
        return res.json();
      })
      .then(() => {
        alert("이슈 수정 완료");
        onClose();
      })
      .catch((error) => console.error("이슈 수정 실패:", error));
  };

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="작업명"
        value={issueName}
        onChange={(e) => setIssueName(e.target.value)}
        required
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      />
      <TextField
        select
        fullWidth
        label="담당자"
        value={managerId}
        onChange={(e) => setManagerId(e.target.value)}
        required
      >
        {managers.map((m) => (
          <MenuItem key={m.id} value={m.id}>
            {m.username}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="상태"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <MenuItem value="진행중">진행중</MenuItem>
        <MenuItem value="완료">완료</MenuItem>
        <MenuItem value="시작 안함">시작 안함</MenuItem>
      </TextField>
      <TextField
        select
        fullWidth
        label="우선순위"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <MenuItem value="높음">높음</MenuItem>
        <MenuItem value="중간">중간</MenuItem>
        <MenuItem value="낮음">낮음</MenuItem>
      </TextField>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          type="date"
          label="시작 날짜"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="date"
          label="마감 날짜"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </Stack>
      <Button variant="contained" onClick={handleSubmit}>
        수정 완료
      </Button>
    </Stack>
  );
};

export default IssueUpdateModal;
