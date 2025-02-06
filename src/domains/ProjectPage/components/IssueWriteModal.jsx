import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const statusMap = {
    '진행중': 'INPROGRESS',
    '시작 안함': 'YET',
    '완료': 'COMPLETE'
};

const priorityMap = {
    '높음': 'HIGH',
    '중간': 'MIDDLE',
    '낮음': 'LOW'
};

const reverseStatusMap = Object.fromEntries(Object.entries(statusMap).map(([k, v]) => [v, k]));
const reversePriorityMap = Object.fromEntries(Object.entries(priorityMap).map(([k, v]) => [v, k]));

const IssueWriteModal = ({ projectId, issue, onClose }) => {
    const [formData, setFormData] = useState({
        issueName: '',
        managerId: '',
        status: 'YET',
        priority: 'MIDDLE',
        startline: '',
        deadline: ''
    });
    
    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8081/projects/${projectId}/members`)
            .then(response => setMembers(response.data))
            .catch(error => console.error("멤버 목록을 불러오는 중 오류 발생:", error));
    }, [projectId]);
    
    useEffect(() => {
        if (issue) {
            setFormData({
                issueName: issue.issueName,
                managerId: issue.manager?.id || '',
                status: reverseStatusMap[issue.status] || 'YET',
                priority: reversePriorityMap[issue.priority] || 'MIDDLE',
                startline: issue.startline,
                deadline: issue.deadline
            });
        }
    }, [issue]);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>이슈 작성</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>작업명</Form.Label>
                        <Form.Control type="text" name="issueName" value={formData.issueName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>담당자</Form.Label>
                        <Form.Select name="managerId" value={formData.managerId} onChange={handleChange} required>
                            <option value="">담당자를 선택하세요</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.nickname}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>상태</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange}>
                            {Object.keys(statusMap).map(kor => (
                                <option key={kor} value={kor}>{kor}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>우선순위</Form.Label>
                        <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
                            {Object.keys(priorityMap).map(kor => (
                                <option key={kor} value={kor}>{kor}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>시작일</Form.Label>
                        <Form.Control type="date" name="startline" value={formData.startline} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>마감일</Form.Label>
                        <Form.Control type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onClose}>취소</Button>
                        <Button variant="primary" type="submit">저장</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default IssueWriteModal;