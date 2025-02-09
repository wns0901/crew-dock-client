import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import axios from 'axios';
import { Box, Button, Card, CardContent, MenuItem, TextField, ButtonGroup, Modal } from '@mui/material';

const IssueWriteModal = ({ projectId, issue, onClose }) => {
    const { userInfo } = useContext(LoginContext);  // 로그인한 사용자 정보 가져오기

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

    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8081/projects/${projectId}/members`)
            .then(response => {
                // authority가 CREW 또는 CAPTAIN인 멤버만 필터링
                const filteredMembers = response.data.filter(member => 
                    member.authority === 'CREW' || member.authority === 'CAPTAIN'
                );
                setMembers(filteredMembers);
                console.log("프로젝트 멤버 목록:", filteredMembers);
            })
            .catch(error => console.error("멤버 목록을 불러오는 중 오류 발생:", error));
    }, [projectId]);

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

    useEffect(() => {
        if (issue) {
            setFormData({
                issueName: issue.issueName,
                managerId: issue.managerId || '', 
                managerName: issue.managerName || '', 
                writerId: issue.writerId || '',
                writerName: issue.writerName || '',
                status: reverseStatusMap[issue.status] || '',
                priority: reversePriorityMap[issue.priority] || '',
                startline: issue.startline,
                deadline: issue.deadline
            });
        }
    }, [issue, userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // 담당자를 변경하면 managerId와 managerName을 함께 변경
        if (name === "managerName") {
            const selectedMember = members.find(member => member.user.nickname === value);
            if (selectedMember) {
                setFormData(prev => ({
                    ...prev,
                    managerId: selectedMember.user.id, // 선택한 담당자의 ID로 managerId 변경
                    managerName: selectedMember.user.nickname // 선택한 담당자의 nickname으로 managerName 변경
                }));
            }
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!projectId) {
            alert("프로젝트 ID가 유효하지 않습니다.");
            return;
        }

        const requestData = {
            ...formData,
            status: statusMap[formData.status],
            priority: priorityMap[formData.priority],
            projectId: projectId
        };

        axios.post(`http://localhost:8081/projects/${projectId}/issues`, requestData)
            .then(() => { 
                alert("새로운 이슈가 추가되었습니다.");
                onClose();
            })
            .catch(error => console.error("이슈 생성 중 오류 발생:", error));
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card sx={{ width: 400, padding: 3 }}>
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
                                <MenuItem key={member.user.id} value={member.user.nickname}>
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
                            <Button onClick={onClose} variant="outlined">취소</Button>
                            <Button onClick={handleSubmit} variant="contained" color="primary">저장</Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default IssueWriteModal;
