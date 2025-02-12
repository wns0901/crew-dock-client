import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import axios from 'axios';
import { Box, Button, Card, CardContent, MenuItem, TextField, ButtonGroup, Modal, IconButton } from '@mui/material';
import { Close } from "@mui/icons-material";
import api from "../../../apis/baseApi";

const IssueAddModal = ({ userId, projectId, issue, onClose, open }) => {
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
    // 한글로 변경해서 보여줌
    const reverseStatusMap = {
        INPROGRESS: "진행중",
        COMPLETE: "완료",
        YET: "시작안함"
    };    

    const reversePriorityMap = {
        HIGH: "높음",
        MIDDLE: "중간",
        LOW: "낮음"
    };

    // 서버로 보내줄 때 변경해서 보내줌 
    const priorityMap = {
        높음: "HIGH",
        중간: "MIDDLE",
        낮음: "LOW"
    };

    const statusMap = {
        진행중: "INPROGRESS",
        완료: "COMPLETE",
        시작안함: "YET"
    };

    // 프로젝트 멤버 불러오기
    useEffect(() => {
        if(!projectId) return;
        console.log("현재 프로젝트 id: ", projectId);
        
        const fetchProjectMember = async () => {
            try {
                const response = await api.get(`/projects/${projectId}/members`);
                console.log("현재 프로젝트 멤버:", response.data);

                // 프로젝트 멤버 필터링 (캡틴과 크루만 불러오기)
                const filterMembers = response.data.filter(member => 
                    member.authority === 'CREW' || member.authority === 'CAPTAIN'
                ).map(member => ({
                    id: member.user.id,
                    nickname: member.user.nickname
                }));
                setMembers(filterMembers);
            } catch (error) {
                console.error("프로젝트 멤버를 불러오는 중 오류 발생", error);
            }
        }
        fetchProjectMember();
    }, [projectId]);

    useEffect(() => {
        if (issue) {
            setFormData({
                issueName: issue.issueName || '',
                managerId: issue.managerId || '', 
                managerName: issue.managerName || '', 
                writerId: issue.writerId || '',
                writerName: issue.writerName || '',
                status: reverseStatusMap[issue.status] || '',
                priority: reversePriorityMap[issue.priority] || '',
                startline: issue.startline || '',
                deadline: issue.deadline || ''
            });
        } else {
            // issue가 없으면 초기값 유지
            setFormData(prev => ({
                ...prev,
                writerId: userInfo?.id || '',
                writerName: userInfo?.nickname || ''
            }));
        }
    }, [issue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // 담당자를 변경하면 managerId와 managerName을 함께 변경
        if (name === "managerName") {
            const selectedMember = members.find(member => member.user.nickname === value);
            if (selectedMember) {
                setFormData(prev => ({
                    ...prev,
                    managerId: selectedMember.id, // 선택한 담당자의 ID로 managerId 변경
                    managerName: selectedMember.nickname // 선택한 담당자의 nickname으로 managerName 변경
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
                status: statusMap[formData.status],
                priority: priorityMap[formData.priority],
                startline: formData.startline,
                deadline: formData.deadline
            });
            alert("새로운 이슈가 추가되었습니다.");
            onClose();
        } catch (error) {
            console.log("이슈 추가에 실패했습니다.", error)
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
        <Modal 
            open={open} 
            PaperProps={{
                sx: {
                  borderRadius: "1.5rem",
                  p: 2,
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
                  position: "absolute",  // 이 부분을 추가하여 날짜 근처로 위치시킬 수 있음
                },
              }}
              BackdropProps={{
                sx: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",  // 배경을 투명하게 설정
                }
              }}
            >
                <IconButton
                    onClick={handleCancelClick}
                    sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "grey.500",
                    }}
                >
                    <Close />
                </IconButton>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card sx={{ maxWidth:"sm", padding: 3 }}>
                    <CardContent>
                        <TextField label="작업명" name="issueName" value={formData.issueName} onChange={handleChange} fullWidth margin="normal" required />
                        <TextField
                            label="담당자"
                            name="managerName"
                            value={formData.managerName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            select
                        >
                            <MenuItem value={userInfo?.nickname}>{userInfo.nickname}</MenuItem>
                            {members.map(member => (
                                <MenuItem key={member.id} value={member.nickname}>
                                    {member.user?.nickname || "담당자 없음"}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="상태"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            select
                        >
                            {Object.keys(statusMap).map(kor => (
                                <MenuItem key={kor} value={kor}>{kor}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="우선순위"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            select
                        >
                            {Object.keys(priorityMap).map(kor => (
                                <MenuItem key={kor} value={kor}>{kor}</MenuItem>
                            ))}
                        </TextField>

                        <TextField 
                            label="시작일"
                            type="date"
                            name="startline"
                            value={formData.startline}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true, 
                            }}
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
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <ButtonGroup fullWidth sx={{ mt: 2 }}>
                            <Button onClick={handleAddClick} variant="contained" color="primary">+ 저장</Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default IssueAddModal;
