import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Container, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const IssueUpdateModal = () => {
  const { projectId } = useParams();
  const { issueId } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState({
    issueName: "",
    managerId: "",
    managerName: "",
    writerId: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [managers, setManagers] = useState([]);

  // 프로젝트 멤버 목록 가져오기
  useEffect(() => {
    axios
      .get(`/projects/${projectId}/members`)
      .then((response) => setManagers(response.data))
      .catch((error) => console.error("프로젝트 멤버 불러오기 실패:", error));

    // 해당 issue 정보 가져오기
    axios
      .get(`/projects/${projectId}/issues/${issueId}`)
      .then((response) => {
        setIssue({
          issueName: response.data.issueName,
          managerId: response.data.managerId,
          managerName: response.data.managerName,
          writerId: response.data.writerId,
          status: response.data.status,
          priority: response.data.priority,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
        });
      })
      .catch((error) => console.error("이슈 정보 가져오기 실패:", error));
  }, [issueId]);

  // 상태 및 우선순위 변환 매핑
  const priorityMap = {
    HIGH: "높음",
    MIDDLE: "중간",
    LOW: "낮음",
  };

  const reversePriorityMap = {
    "높음": "HIGH",
    "중간": "MIDDLE",
    "낮음": "LOW",
  };

  const statusMap = {
    INPROGRESS: "진행중",
    COMPLETE: "완료",
    YET: "시작안함",
  };

  const reverseStatusMap = {
    "진행중": "INPROGRESS",
    "완료": "COMPLETE",
    "시작안함": "YET",
  };

  const changeValue = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const submitIssue = (e) => {
    e.preventDefault();

    const updatedIssue = {
      issueName: issue.issueName,
      managerId: issue.managerId,
      managerName: issue.managerName,
      writerId: issue.writerId,
      status: reverseStatusMap[issue.status] || issue.status,
      priority: reversePriorityMap[issue.priority] || issue.priority,
      startDate: issue.startDate,
      endDate: issue.endDate,
    };

    axios
      .put(`/projects/${projectId}/issues/${issueId}`, updatedIssue, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("이슈 수정 성공");
          navigate(`/projects/${projectId}/issues/${issueId}`);
        } else {
          alert("이슈 수정 실패");
        }
      })
      .catch((error) => {
        console.error("이슈 수정 실패:", error);
        alert("이슈 수정 실패");
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
        <h4>이슈 수정정</h4>
        <form onSubmit={submitIssue}>
          <TextField
            label="작업명"
            fullWidth
            variant="outlined"
            margin="normal"
            name="issueName"
            value={issue.issueName}
            onChange={changeValue}
            required
          />

          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>담당자</InputLabel>
            <Select
              label="담당자"
              name="managerName"
              value={issue.managerName}
              onChange={changeValue}
            >
              <MenuItem value="">
                <em>담당자를 선택하세요</em>
              </MenuItem>
              {managers.map((m) => (
                <MenuItem key={m.managerName} value={m.managerName}>
                  {m.nickname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>상태</InputLabel>
            <Select
              label="상태"
              name="status"
              value={issue.status}
              onChange={changeValue}
            >
              {Object.values(statusMap).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>우선순위</InputLabel>
            <Select
              label="우선순위"
              name="priority"
              value={issue.priority}
              onChange={changeValue}
            >
              {Object.values(priorityMap).map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="시작 날짜"
            fullWidth
            variant="outlined"
            margin="normal"
            type="date"
            name="startDate"
            value={issue.startDate}
            onChange={changeValue}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="마감 날짜"
            fullWidth
            variant="outlined"
            margin="normal"
            type="date"
            name="endDate"
            value={issue.endDate}
            onChange={changeValue}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(`/projectsIssue`)}
            >
              취소
            </Button>
            <Button variant="contained" color="primary" type="submit">
              수정완료
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default IssueUpdateModal;
