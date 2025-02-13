import React, { useContext, useState, useEffect } from "react";
import { 
    Box, Button, TextField, Typography, MenuItem, Select, 
    InputLabel, FormControl, Autocomplete, Chip, Input 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../contexts/LoginContextProvider";


const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        stacks: [] // 이 배열에 ID 값을 저장
    });
    const [captain, setCaptain] = useState(null);
    const [availableStacks, setAvailableStacks] = useState([]); // 서버에서 가져올 기술 스택 리스트
    const [file, setFile] = useState(null); // 파일 상태 추가
    const [previewUrl, setPreviewUrl] = useState(""); // 이미지 미리보기 URL
    // 현재 로그인한 사용자가 CAPTAIN인지 확인
    const isCaptain = projectRoles.some(
        (role) => Number(role.projectId) === Number(projectId) && role.role.isCaptain
    );

    useEffect(() => {
        // 프로젝트 정보 가져오기
        axios.get(`${BASE_URL}/projects/${projectId}`)
            .then((response) => {
                const projectData = response.data;
                
                // stacks를 id 값으로 저장
                const formattedStacks = projectData.stacks?.map(stackItem => stackItem.stack?.id) || [];
                setProject(projectData);
                setUpdatedProject({
                    ...projectData,
                    stacks: formattedStacks, 
                    status: projectData.status || ""
                });
                if (projectData.imgUrl) {
                    setPreviewUrl(projectData.imgUrl);
                }
            })
            .catch((error) => {
                console.error("프로젝트 정보 조회 실패:", error);
            });

        // 프로젝트 멤버 조회
        axios.get(`${BASE_URL}/projects/${projectId}/members`)
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

        // 사용 가능한 스택 리스트 가져오기
        axios.get(`${BASE_URL}/stacks`)
            .then((response) => {
                const stacks = response.data.map((stack) => ({
                    id: stack.id,
                    name: stack.name
                }));
                setAvailableStacks(stacks);
            })
            .catch((error) => {
                console.error("기술 스택 리스트 조회 실패:", error);
            });
    }, [projectId]);
    

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setUpdatedProject({
            ...updatedProject,
            [name]: value
        });
    };

    const handleStackChange = (event, newValue) => {
        // 선택된 스택 객체에서 id만 추출하여 updatedProject.stacks에 저장
        setUpdatedProject({
            ...updatedProject,
            stacks: newValue.map(stack => stack.id) // id 값만 저장
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // 이미지 파일 상태 업데이트

        if (selectedFile){
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();

        const data ={
            id: projectId,
            name: updatedProject.name,
            period: updatedProject.period,
            startDate: updatedProject.startDate,
            status: updatedProject.status,
            githubUrl1: updatedProject.githubUrl1,
            githubUrl2: updatedProject.githubUrl2,
            designUrl: updatedProject.designUrl,
            introduction: updatedProject.introduction,
            stackIds: [updatedProject.stacks],
        };

        for (const key in data) {
            formData.append(key, data[key]);
        }

        if (file) {
            formData.append("file", file);
        }
    
        // Content-Type은 자동으로 'multipart/form-data'로 설정됨
     axios.patch(`${BASE_URL}/projects`, formData)
    .then(() => {
        alert("프로젝트 정보가 수정되었습니다.");
        navigate(`/projects/${projectId}`);
    })
    .catch((error) => {
        console.error("프로젝트 정보 수정 실패:", error);
    });
    };
    

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

            <Box 
    sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 2, // 간격 조정
        marginBottom: 2 
    }}
>
    {/* 원형 이미지 미리보기 */}
    <Box 
        sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: "50%", 
            overflow: "hidden", 
            border: "2px solid #ddd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
{previewUrl || setPreviewUrl ? (
    <img 
        src={previewUrl || setPreviewUrl} 
        alt="미리보기" 
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
    />
) : (
    <Typography variant="body2">이미지 없음</Typography>
)}
    </Box>

   
</Box>
<Box 
    sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 2, // 간격 조정
        marginBottom: 2 
    }}
>
<Input
        type="file"
        onChange={handleFileChange}
        disabled={!isCaptain}
    />

</Box>

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
                    InputProps={{ readOnly: true }}
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
                    InputProps={{ readOnly: true }}
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
                        disabled={!isCaptain}
                    >
                        {Object.entries(statusMap).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 기술 스택 선택 */}
                <Autocomplete
                    multiple
                    options={availableStacks}
                    value={updatedProject.stacks.map(stackId => 
                        availableStacks.find(stack => stack.id === stackId)
                    )}
                    onChange={handleStackChange}
                    getOptionLabel={(option) => option.name} // name만 표시
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip 
                                label={option.name} // name 표시
                                {...getTagProps({ index })} 
                                key={option.id}  // id 사용
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="기술 스택" placeholder="스택 추가" />
                    )}
                    disabled={!isCaptain}
                    sx={{ marginBottom: 2 }}
                />

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
