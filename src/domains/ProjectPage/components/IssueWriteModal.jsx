import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import axios from 'axios';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, ButtonGroup, Modal } from '@mui/material';

const IssueWriteModal = ({ projectId, issue, onClose }) => {
    const { userInfo } = useContext(LoginContext);  // 로그인한 사용자 정보 가져오기

    const [formData, setFormData] = useState({
        issueName: '',
        managerId: '',
        writerId: userInfo?.id || '',  // 🛠 안전한 초기화
        status: '',
        priority: '',
        startline: '',
        deadline: ''
    });

    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8081/projects/${projectId}/members`)
            .then(response => setMembers(response.data))
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
                managerId: issue.user?.id || '',
                writerId: userInfo?.id || '',
                status: reverseStatusMap[issue.status] || '',
                priority: reversePriorityMap[issue.priority] || '',
                startline: issue.startline,
                deadline: issue.deadline
            });
        }
    }, [issue]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const requestData = {
            ...formData,
            status: statusMap[formData.status],
            priority: priorityMap[formData.priority]
        };

        axios.post(`http://localhost:8081/projects/${projectId}/issues`, requestData)
            .then(() => onClose())
            .catch(error => console.error("이슈 생성 중 오류 발생:", error));
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card sx={{ width: 400, padding: 3 }}>
                    <CardContent>
                        <TextField label="작업명" name="issueName" value={formData.issueName} onChange={handleChange} fullWidth margin="normal" required />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>담당자</InputLabel>
                            <Select name="managerId" value={formData.managerId} onChange={handleChange}>
                            <MenuItem value="">담당자를 선택하세요.</MenuItem>
                                {members.map(member => (
                                    <MenuItem key={member.id} value={member.id}>
                                        {member.user?.nickname || "담당자 없음"}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>상태</InputLabel>
                            <Select name="status" value={formData.status} onChange={handleChange}>
                                {Object.keys(statusMap).map(kor => (
                                    <MenuItem key={kor} value={kor}>{kor}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>우선순위</InputLabel>
                            <Select name="priority" value={formData.priority} onChange={handleChange}>
                                {Object.keys(priorityMap).map(kor => (
                                    <MenuItem key={kor} value={kor}>{kor}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="시작일" type="date" name="startline" value={formData.startline} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
                        <TextField label="마감일" type="date" name="deadline" value={formData.deadline} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />

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
