import React, { useContext, useEffect, useState } from "react";
import {
    Box, Button, TextField, Typography, Modal, IconButton,
    Select, MenuItem, InputLabel, FormControl, Autocomplete, Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoginContext } from "../../../contexts/LoginContextProvider"; // ✅ LoginContext 가져오기
import axios from "axios";
import dayjs from "dayjs";
import api from "../../../apis/baseApi";

const API_BASE_URL = api.defaults.baseURL; 

const ProjectsModal = ({ open, handleClose, handleCreateProject }) => {
    const { userInfo } = useContext(LoginContext); // ✅ userInfo 가져오기

    const [newProject, setNewProject] = useState({
        name: "",
        startDate: dayjs().format("YYYY-MM-DD"),
        period: "3", // ✅ 기본값을 숫자가 아닌 문자열로 유지
        stacks: [],
        position: "" // ✅ 초기값
    });

    const [stacks, setStacks] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/stacks/all`)
            .then((response) => {
                console.log("📌 불러온 기술 스택 데이터:", response.data);
                setStacks(response.data);  // ✅ `setStacks`를 객체 배열로 저장
            })
            .catch((error) => console.error("🚨 기술 스택 불러오기 실패:", error));
    }, [userInfo]);
    
    

    const handleInputChange = (e) => {
        setNewProject({ ...newProject, [e.target.name]: e.target.value });
    };

    const handleStackChange = (event, value) => {
        setNewProject({ ...newProject, stacks: value });
    };

    const handleSubmit = () => {
        alert("프로젝트 생성 완료 ! ");
        handleCreateProject(newProject);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                width: "400px", backgroundColor: "white", padding: 3, borderRadius: 2,
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">프로젝트 추가</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>

                <TextField label="프로젝트명" name="name" fullWidth margin="dense" value={newProject.name} onChange={handleInputChange} />

                <FormControl fullWidth margin="dense">
                    <InputLabel>진행 기간</InputLabel>
                    <Select name="period" value={newProject.period} onChange={handleInputChange}>
                        <MenuItem value="1">1개월</MenuItem>
                        <MenuItem value="3">3개월</MenuItem>
                        <MenuItem value="6">6개월</MenuItem>
                        <MenuItem value="0">기한 없음</MenuItem>
                    </Select>
                </FormControl>

                {/* 🔥 담당 포지션 선택 (userInfo 기반) */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>담당 포지션</InputLabel>
                    <Select name="position" value={newProject.position} onChange={handleInputChange}>
                        <MenuItem value="BACK">백엔드</MenuItem>
                        <MenuItem value="FRONT">프론트엔드</MenuItem>
                        <MenuItem value="FULLSTACK">풀스택</MenuItem>
                        <MenuItem value="DESIGNER">디자이너</MenuItem>
                    </Select>
                </FormControl>

                {/* 🔥 기술 스택 선택 */}
                <Autocomplete
                    multiple
                    options={stacks.map((stack, index) => ({ id: index + 1, stackName: stack }))} // ✅ 객체 배열로 변환
                    value={newProject.stacks}  
                    getOptionLabel={(option) => (typeof option === "string" ? option : option.stackName)} // ✅ 문자열 & 객체 둘 다 처리
                    isOptionEqualToValue={(option, value) => option.id === value.id} // ✅ 정확한 비교
                    onChange={(event, value) => {
                        console.log("📌 선택한 스택 (객체 리스트):", value);
                        setNewProject({ ...newProject, stacks: value }); 
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip label={option.stackName} {...getTagProps({ index })} key={option.id} /> // ✅ key 설정
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="기술 스택" placeholder="스택 추가" />}
                />




                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>추가</Button>
                    <Button variant="outlined" onClick={handleClose}>취소</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ProjectsModal;
