import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Container, Box } from "@mui/material";
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../baseApi.js";

const IssueUpdateModal = () => {
  const projectId = 1;  // 하드코딩된 프로젝트 ID
  const { userInfo, projectRoles} = useContext(LoginContext);
  const { issueId } = useParams(); // URL에서 동적으로 issueId를 가져옵니다.
  const navigate = useNavigate();

  const [issue, setIssue] = useState({
    projectId: "",
    issueId: "",
    issueName: "",
    managerId: "",
    managerName: "",
    writerId: "",
    writerName: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [managers, setManagers] = useState([]);

  // 프로젝트 멤버 목록 가져오기
  useEffect(() => {
    console.log("issueId:", issueId); // issueId 값 확인

    if (!issueId) {
      console.error("이슈 ID가 유효하지 않습니다.");
      return; // issueId가 유효하지 않으면 API 호출을 중지합니다.
    }

    // 프로젝트 멤버 가져오기
    axios
    .get(`/projects/${projectId}/members`)
      .then((response) => {
        setManagers(Array.isArray(response.data) ? response.data : []);
        console.log("프로젝트 멤버 목록", setManagers);
        console.log("유저 정보", userInfo);
        console.log("프로젝트 ID:", projectId);
        console.log("프로젝트 권한: ", projectRoles);
      })
      .catch((error) => console.error("프로젝트 멤버 불러오기 실패:", error));

    // 이슈 정보 가져오기
    axios
      .get(`/projects/${projectId}/issues/${issueId}`)
      .then((response) => {
        const { data, status } = response;
        if (status === 200) {
          setIssue(data);
        } else {
          alert('이슈 정보 가져오기 실패');
        }
      })
      .catch((error) => console.error("이슈 정보 가져오기 실패:", error));
  }, [projectId, issueId]);

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

  const handleManagerChange = (e) => {
    const selectedManager = managers.find(m => m.managerId === e.target.value);
    setIssue({
      ...issue,
      managerId: selectedManager.managerId, 
      managerName: selectedManager.nickname
    });
  };

  const submitIssue = (e) => {
    e.preventDefault();

    const updatedIssue = {
      issueId: issueId, // issueId를 body에 포함
      issueName: issue.issueName,
      managerId: issue.managerId,
      managerName: issue.managerName,
      writerId: issue.writerId,
      writerName: issue.writerName,
      status: reverseStatusMap[issue.status] || issue.status,
      priority: reversePriorityMap[issue.priority] || issue.priority,
      startDate: issue.startDate,
      endDate: issue.endDate,
    };

    axios
      .patch(`/projects/${projectId}/issues`, updatedIssue, {
        headers: { "Content-Type": "application/json;charset=utf-8" },
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
    <Container maxWidth="sm" sx={{ mt: 4 }} value={issue.issueId}>
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
        <h4>이슈 수정</h4>
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
              value={issue.managerId || ""}
              onChange={handleManagerChange}
            >
              <MenuItem value="">
                <em>{issue.managerName || "담당자 선택"}</em>
              </MenuItem>
              {managers.map((m) => (
                <MenuItem key={m.managerId} value={m.managerId}>
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="secondary">
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
