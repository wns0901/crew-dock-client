import React, { useContext, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const ProjectSettings = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { projectRoles } = useContext(LoginContext);
    
    const [project, setProject] = useState(null);
    const [updatedProject, setUpdatedProject] = useState({
        name: "",
        period: "",
        startDate: "",
        status: "",
        githubUrl1: "",
        githubUrl2: "",
        designUrl: "",
        imgUrl: "",
        introduction: "",
        stacks: []
    });
    const [captain, setCaptain] = useState(null);

    // 현재 로그인한 사용자가 CAPTAIN인지 확인
    const isCaptain = projectRoles.some(
        (role) => Number(role.projectId) === Number(projectId) && role.role.isCaptain
    );

    useEffect(() => {
        axios.get(`http://localhost:8080/projects/${projectId}`)
            .then((response) => {
                const projectData = response.data;
                setProject(projectData);

                setUpdatedProject({
                    ...projectData,
                    status: projectData.status || ""
                });
            })
            .catch((error) => {
                console.error("프로젝트 정보 조회 실패:", error);
            });

        axios.get(`http://localhost:8080/projects/${projectId}/members`)
            .then((response) => {
                const members = response.data;
                const captainMember = members.find(member => member.authority === "CAPTAIN");
                if (captainMember) {
                    setCaptain(captainMember);
                } else {
                    console.error("프로젝트장 정보 조회 실패:");
                }
            })
            .catch((error) => {
                console.error("프로젝트 멤버 조회 실패:", error);
            });
    }, [projectId]);

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setUpdatedProject({
            ...updatedProject,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const projectWithId = { ...updatedProject, id: projectId };

        axios.patch(`http://localhost:8080/projects`, projectWithId)
            .then(() => {
                alert("프로젝트 정보가 수정되었습니다.");
                navigate(`/projects/${projectId}`);
            })
            .catch((error) => {
                console.error("프로젝트 정보 수정 실패:", error);
            });
    };

    if (!project) {
        return null;
    }

    const statusMap = {
        BOARDING: "승선중",
        CRUISING: "항해중",
        COMPLETED: "항해완료",
        SINKING: "난파"
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                프로젝트 설정
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>

                <TextField
                    label="이미지 URL"
                    name="imgUrl"
                    value={updatedProject.imgUrl}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }} 
                />

                <TextField
                    label="프로젝트 이름"
                    name="name"
                    value={updatedProject.name}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }}
                />

                <TextField
                    label="프로젝트 소개"
                    name="introduction"
                    value={updatedProject.introduction}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }}
                />

                <TextField
                    label="GitHub URL 1"
                    name="githubUrl1"
                    value={updatedProject.githubUrl1}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }}
                />

                <TextField
                    label="GitHub URL 2"
                    name="githubUrl2"
                    value={updatedProject.githubUrl2}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }}
                />

                <TextField
                    label="디자인 URL"
                    name="designUrl"
                    value={updatedProject.designUrl}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: !isCaptain }}
                />

                <TextField
                    label="시작일"
                    name="startDate"
                    type="date"
                    value={updatedProject.startDate}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: true }} // 시작일은 항상 수정 불가능
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="기간(개월)"
                    name="period"
                    type="number"
                    value={updatedProject.period}
                    onChange={handleUpdate}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    InputProps={{ readOnly: true }} // 기간도 항상 수정 불가능
                />

                {captain && (
                    <TextField
                        label="프로젝트 CAPTAIN"
                        value={captain.user.name}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        InputProps={{ readOnly: true }}
                    />
                )}

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>상태</InputLabel>
                    <Select
                        name="status"
                        value={updatedProject.status}
                        onChange={handleUpdate}
                        label="상태"
                        disabled={!isCaptain} // CAPTAIN이 아니면 변경 불가능
                    >
                        {Object.entries(statusMap).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* CAPTAIN만 저장 버튼 보이게 */}
                {isCaptain && (
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        sx={{ marginTop: 2 }}
                    >
                        저장
                    </Button>
                )}
            </form>
        </Box>
    );
};

export default ProjectSettings;
