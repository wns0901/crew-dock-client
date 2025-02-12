import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import axios from 'axios';
import { Box, Select, InputLabel,  TableContainer, FormControl, Table, TableHead, TableRow, TableCell, Button, Card, CardContent, MenuItem, TextField, ButtonGroup, Modal, IconButton, TableBody } from '@mui/material';
import { Close, Check } from "@mui/icons-material";
import api from "../../../apis/baseApi";

const IssueAddModal = ({ projectId, issue, onClose, open, onAddIssue }) => {
    const { userInfo, projectRoles } = useContext(LoginContext);  // 로그인한 사용자 정보 가져오기
    const [members, setMembers] = useState([]); // 해당 프로젝트 멤버 불러오기

    const [formData, setFormData] = useState({
        issueName: '',
        managerId: '',
        managerName: '',
        writerId: userInfo?.id || '',
        writerName: userInfo?.nickname || '',
        status: '',
        priority: '',
        startline: '',
        deadline: ''
    });
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

    // 프로젝트 멤버 불러오기
    useEffect(() => {
        if(!projectId) return;
        console.log("현재 로그인한 유저: ", userInfo.nickname);
        console.log("현재 프로젝트 id: ", projectId);
        
        const fetchProjectMember = async () => {
            try {
                const response = await api.get(`/projects/${projectId}/members`);
                console.log("현재 프로젝트 멤버:", response.data);

                // 프로젝트 멤버 필터링 (캡틴과 크루만 불러오기)
                const filterMembers = response.data.filter(member => 
                    member.authority === 'CREW' || member.authority === 'CAPTAIN'
                ).map(member => ({
                    managerId: member.user.id,
                    managerName: member.user.nickname
                }));
                setMembers(filterMembers);
            } catch (error) {
                console.error("프로젝트 멤버를 불러오는 중 오류 발생", error);
            }
        }
        fetchProjectMember();
    }, [projectId]);


useEffect(() => {
    if (userInfo) {
        setFormData(prevState => ({
            ...prevState,
            managerId: userInfo.id, // 로그인한 유저의 ID로 초기화
            managerName: userInfo.nickname, // 로그인한 유저의 이름으로 초기화
        }));
      }
}, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // 담당자를 변경하면 managerId와 managerName을 함께 변경
        if (name === "managerId") {
            const selectedMember = members.find(member => member.managerId === value);
            console.log("selectedMember: ", selectedMember);
            if (selectedMember) {
                setFormData(prev => ({
                    ...prev,
                    managerId: selectedMember.managerId, // 선택한 담당자의 ID로 managerId 변경
                    managerName: selectedMember.managerName // 선택한 담당자의 nickname으로 managerName 변경
                }));
            }
        }
    };

    // 작성 완료 핸들러러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(`/projects/${projectId}/issues`, {
                issueName: formData.issueName, 
                managerId: formData.managerId,  
                managerName: formData.managerName,  
                writerId: formData.writerId,
                writerName: formData.writerName,
                status: reverseStatusMap[formData.status] || formData.status,
                priority: reversePriorityMap[formData.priority] || formData.priority,
                startline: formData.startline,
                deadline: formData.deadline
            });
            onAddIssue(response.data); 
            alert("새로운 이슈가 추가되었습니다.");
            onClose();
        } catch (error) {
            console.log("이슈 추가에 실패했습니다.", error)
            alert("이슈 추가에 실패했습니다.")
        }
    };

      // 취소 버튼 클릭 시 모달 닫기
    const handleCancelClick = () => {
        onClose();
    };

    // 추가 버튼 클릭 시 이슈 추가
    const handleAddClick = (event) => {
        handleSubmit(event);
    };

    return (
        <Box sx={{ backgroundColor: 'transparent' }}>
            <h3>작업 추가</h3>
            <IconButton
            onClick={handleCancelClick}
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'grey.500',
            }}
            >
                <Close />
            </IconButton>
            <form onSubmit={handleAddClick}>
                <TextField
                    label="작업명"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    name="issueName"
                    value={formData.issueName}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel>담당자</InputLabel>
                    <Select
                        label="담당자"
                        name="managerId"
                        value={formData.managerId || ""}
                        onChange={handleChange}
                    > 
                        <MenuItem value="">
                            <em>{formData.managerName || '담당자 없음'}</em>
                        </MenuItem>
                        {members.map((member) => (
                            <MenuItem key={member.managerId|| member.managerName} value={member.managerId}>
                            {member.managerName || '담당자 없음'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel>상태</InputLabel>
                    <Select
                        label="상태"
                        name="status"
                        value={statusMap[formData.status] || ''}
                        onChange={(e) => {
                            const selectedStatus = e.target.value;
                            handleChange({
                                target: {
                                name: 'status',
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
                        value={priorityMap[formData.priority] || ''}
                        onChange={(e) => {
                            const selectedPriority = e.target.value;
                            handleChange({
                                target: {
                                name: 'priority',
                                value: reversePriorityMap[selectedPriority] || selectedPriority,
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
                    value={formData.startline}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                />
            
                < TextField
                    label="마감 날짜"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                />
        
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        <Check />저장
                    </Button>
                </Box>
            </form>
        
        {/* <form onSubmit={handleAddClick}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>작업명</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>담당자</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>상태</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>우선순위</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>타임라인</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    label="작업명"
                    name="issueName"
                    value={formData.issueName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="담당자"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    select
                    required
                  >
                    <MenuItem value={userInfo?.nickname}>{userInfo.nickname}</MenuItem>
                    {members.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.user?.nickname || '담당자 없음'}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    label="상태"
                    name="status"
                    value={statusMap[formData.status] || ''}
                    onChange={(e) => {
                      const selectedStatus = e.target.value;
                      handleChange({
                        target: {
                          name: 'status',
                          value: reverseStatusMap[selectedStatus] || selectedStatus,
                        },
                      });
                    }}
                    fullWidth
                    margin="normal"
                    select
                    required
                  >
                    {Object.keys(statusMap).map((kor) => (
                      <MenuItem key={kor} value={kor}>
                        {kor}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    label="우선순위"
                    name="priority"
                    value={priorityMap[formData.priority] || ''}
                    onChange={(e) => {
                      const selectedPriority = e.target.value;
                      handleChange({
                        target: {
                          name: 'priority',
                          value: reversePriorityMap[selectedPriority] || selectedPriority,
                        },
                      });
                    }}
                    fullWidth
                    margin="normal"
                    select
                    required
                  >
                    {Object.keys(priorityMap).map((kor) => (
                      <MenuItem key={kor} value={kor}>
                        {kor}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="시작일"
                      type="date"
                      name="startline"
                      value={formData.startline}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="마감일"
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelClick}
                    >
                      취소
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      <Check />
                      저장
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form> */}
      </Box>
    );
}

export default IssueAddModal;
