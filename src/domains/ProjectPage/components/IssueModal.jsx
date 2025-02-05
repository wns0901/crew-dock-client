import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Grid } from "@mui/material";

const IssueModal = ({ projectId, issue, onClose }) => {
  const [issueName, setIssueName] = useState(issue?.issueName || "");
  const [managerId, setManagerId] = useState(issue?.manager?.id || "");
  const [status, setStatus] = useState(issue?.status || "");
  const [priority, setPriority] = useState(issue?.priority || "");
  const [startDate, setStartDate] = useState(issue?.startline || "");
  const [endDate, setEndDate] = useState(issue?.deadline || "");
  const [managers, setManagers] = useState([]);

  // 프로젝트의 담당자 목록 가져오기 > 서버 url : /projects/{projectId}/members >> get 방식
  useEffect(() => {
    fetch(`/projects/${projectId}/members`)
      .then((res) => res.json())
      .then((data) => setManagers(data))
      .catch((error) => console.error("담당자 불러오기 실패:", error));
  }, [projectId]);

  // 저장 (추가 or 수정)
  const handleSubmit = () => {
    if (!issueName || !managerId || !status || !priority || !startDate || !endDate) {
      alert("모든 필수 항목을 입력하세요!");
      return;
    }

    const newIssue = { issueName, managerId, status, priority, startline: startDate, deadline: endDate };

    const method = issue ? "PATCH" : "POST";
    const url = issue
      ? `/projects/${projectId}/issues/${issue.id}`
      : `/projects/${projectId}/issues`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssue),
    })
      .then((res) => {
        if (!res.ok) throw new Error("이슈 저장 실패");
        return res.json();
      })
      .then(() => {
        alert(issue ? "이슈 수정 완료" : "이슈 추가 완료");
        onClose();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField fullWidth label="작업명" value={issueName} onChange={(e) => setIssueName(e.target.value)} required />
      </Grid>
      <Grid item xs={6}>
        <TextField select fullWidth label="담당자" value={managerId} onChange={(e) => setManagerId(e.target.value)} required>
          {managers.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.username}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField select fullWidth label="상태" value={status} onChange={(e) => setStatus(e.target.value)} required>
          <MenuItem value="진행중">진행중</MenuItem>
          <MenuItem value="완료">완료</MenuItem>
          <MenuItem value="시작 안함">시작 안함</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField select fullWidth label="우선순위" value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <MenuItem value="높음">높음</MenuItem>
          <MenuItem value="중간">중간</MenuItem>
          <MenuItem value="낮음">낮음</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth type="date" label="시작 날짜" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <TextField fullWidth type="date" label="마감 날짜" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSubmit}>저장</Button>
      </Grid>
    </Grid>
  );
};

export default IssueModal;
