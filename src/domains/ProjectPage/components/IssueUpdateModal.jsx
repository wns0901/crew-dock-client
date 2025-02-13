import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Container, Box } from "@mui/material";
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/baseApi";

const IssueUpdateModal = ({selectIssue, onClose, projectId, onUpdateIssue}) => {
  const { userInfo, projectRoles} = useContext(LoginContext);
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const { issueId } = selectIssue;

  console.log("전달받은 issue: ", selectIssue);

  const [issue, setIssue] = useState({
    issueId: "",
    issueName: "",
    managerId: "",
    managerName: "",
    writerId: "",
    writerName: "",
    status: "",
    priority: "",
    startline: "",
    deadline: "",
  });

  useEffect(() => {
    if (selectIssue) {
      setIssue({
        ...selectIssue
      }
    );
  }
  }, [selectIssue]);

  // 프로젝트 멤버 목록 가져오기
  useEffect(() => {
    if (!projectId) return;
    console.log("projectId: ", projectId); 
    console.log("issueId:", issueId);

    if (!issueId) {
      console.error("이슈 ID가 유효하지 않습니다.");
      return;
    }

    // 프로젝트 멤버 가져오기
    api
    .get(`/projects/${projectId}/members`)
      .then((response) => {
        const filteredManagers = response.data.filter(
          (member) => member.authority === "CREW" || member.authority === "CAPTAIN"
        );
        console.log(filteredManagers);
        
        setManagers(filteredManagers);
        console.log("프로젝트 멤버 목록:", managers);
        
      })
      .catch((error) => console.error("프로젝트 멤버 불러오기 실패:", error));

    // 해당 이슈 정보 가져오기
    if (issueId) {
      api
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
      }
  }, [projectId, issueId]);

 // 상태 및 우선순위 맵핑
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

  const changeValue = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleManagerChange = (e) => {
    const selectedManager = managers.find(m => m.id === e.target.value);
    if (selectedManager) {
      setIssue({
        ...issue,
        managerId: selectedManager.id, 
        managerName: selectedManager.user.nickname || "", // 담당자 이름 설정
      });
    }
  };

  const submitIssue = (e) => {
    e.preventDefault();

    const updatedIssue = {
      issueId: issueId,
      issueName: issue.issueName,
      managerId: issue.managerId,
      managerName: issue.managerName,
      writerId: issue.writerId,
      writerName: issue.writerName,
      status: reverseStatusMap[issue.status] || issue.status,
      priority: reversePriorityMap[issue.priority] || issue.priority,
      startline: issue.startline,
      deadline: issue.deadline,
    };

    console.log("업데이트된 이슈: ", updatedIssue);
    
    api
      .patch(`/projects/${projectId}/issues/${issueId}`, updatedIssue, {
        headers: { "Content-Type": "application/json;charset=utf-8" },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("수정되었습니다.");
          // setIssue(updatedIssue);
          onUpdateIssue(updatedIssue);
          onClose();
        } else {
          alert("수정 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("이슈 수정 실패:", error);
        alert("수정 실패했습니다.");
      });
  };

  return (
      <Box value={issueId} sx={{backgroundColor: 'transparent'}}>
        <h3>이슈 수정</h3>
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
              name="managerId"
              value={issue.managerId || ""}
              onChange={handleManagerChange}
            >
              <MenuItem value="">
                <em>{issue.managerName || ""}</em>
              </MenuItem>
              {managers.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.user.nickname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>상태</InputLabel>
            <Select
              label="상태"
              name="status"
              value={statusMap[issue.status] || ""}
              onChange={(e) => {
                const selectedStatus = e.target.value;
                changeValue({
                  target: {
                    name: "status",
                    value: reverseStatusMap[selectedStatus] || selectedStatus,
                  },
                });
              }}
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
              value={priorityMap[issue.priority] || ""}
              onChange={(e) => {
                const selectedPriority = e.target.value;
                changeValue({
                  target: {
                    name: "priority",
                    value: reversePriorityMap[selectedPriority] || selectedPriority, // reverseMap을 사용해 원래 값으로 변환
                  },
                });
              }}
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
            name="startline"
            value={issue.startline}
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
            name="deadline"
            value={issue.deadline}
            onChange={changeValue}
            required
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              취소
            </Button>
            <Button variant="contained" color="primary" type="submit">
              수정완료
            </Button>
          </Box>
        </form>
      </Box>
  );
};

export default IssueUpdateModal;
