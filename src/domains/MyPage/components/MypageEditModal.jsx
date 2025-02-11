import React, { useContext, useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Modal, IconButton,
    Select, MenuItem, InputLabel, FormControl, Autocomplete, Chip, Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const MypageEdit = ({ open, onClose, userId }) => {
    const { userInfo, setUserInfo } = useContext(LoginContext);

   
    const effectiveUserId = userId || userInfo?.id;

    const [userData, setUserData] = useState({
        id: "",
        name: "",
        nickname: "",
        username: "",
        phoneNumber: "",
        githubUrl: "",
        notionUrl: "",
        blogUrl: "",
        hopePosition: "",
        stackIds: [],   // 🔥 백엔드에서 기대하는 형식으로 변경
        selfIntroduction: ""
    });

    const [availableStacks, setAvailableStacks] = useState([]);  // 🔥 전체 스택 리스트
    const [stackIdMap, setStackIdMap] = useState(new Map());      // 🔥 { "JavaScript": 1, "TypeScript": 2, ... }

   
    useEffect(() => {
        if (!effectiveUserId) return;

        console.log("🔍 Fetching user data for ID:", effectiveUserId);

        axios.get(`${API_BASE_URL}/user/${effectiveUserId}`)
            .then((response) => {
                console.log(" 유저 데이터 수신:", response.data);
                setUserData({
                    ...response.data,
                    stackIds: response.data.stacks || [], 
                });
            })
            .catch((error) => console.error("❌ 유저 정보 불러오기 실패:", error));

    
        axios.get(`${API_BASE_URL}/stacks/all`)
            .then((response) => {
                console.log("✅ 전체 스택 리스트:", response.data);
                
            
                const mapping = new Map(response.data.map((stack, index) => [stack, index + 1]));
                setStackIdMap(mapping);

         
                setAvailableStacks(response.data);
            })
            .catch((error) => console.error("❌ 기술 스택 리스트 조회 실패:", error));

    }, [effectiveUserId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const handleStackChange = (event, newValue) => {
        setUserData({
            ...userData,
            stackIds: newValue
        });
    };

    
    const handleSubmit = async () => {
        try {
            
            const stackIds = userData.stackIds
                .map(stack => stackIdMap.get(stack))
                .filter(id => id !== undefined); 

            const updatedUserData = {
                ...userData,
                stackIds, 
            };

            delete updatedUserData.stacks; 

            await axios.patch(`${API_BASE_URL}/user/${effectiveUserId}`, updatedUserData);

            onClose();
            alert("회원 정보가 수정되었습니다.");
            setUserInfo(prev => ({ ...prev, ...updatedUserData }));
            
        } catch (error) {
            console.error("❌ 회원 정보 수정 실패:", error, error.response);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                width: "400px", maxHeight: "75vh", overflowY: "auto", backgroundColor: "white", padding: 3, borderRadius: 2,
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"
            }}>
                {/* 닫기 버튼 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">프로필 수정</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                {/* 프로필 이미지 */}
                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar sx={{ width: 80, height: 80, backgroundColor: "#ddd" }}>
                        {userData.nickname.charAt(0) || "?"}
                    </Avatar>
                </Box>

                <Button fullWidth variant="contained" sx={{ mb: 2 }}>사진 변경</Button>

                {/* 기본 정보 */}
                <TextField label="실명" fullWidth margin="dense" value={userData.name} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f5f5f5" }} />
                <TextField label="닉네임" name="nickname" fullWidth margin="dense" value={userData.nickname} onChange={handleChange} />
                <TextField label="이메일" fullWidth margin="dense" value={userData.username} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f5f5f5" }} />
                <TextField label="전화번호" name="phoneNumber" fullWidth margin="dense" value={userData.phoneNumber} onChange={handleChange} />
                <TextField lable="한줄소개" name="selfIntroduction" fullWidth margin="dense" value={userData.selfIntroduction} onChange={handleChange} />

                {/* 링크 정보 */}
                <TextField label="GitHub" name="githubUrl" fullWidth margin="dense" value={userData.githubUrl} onChange={handleChange} />
                <TextField label="Notion" name="notionUrl" fullWidth margin="dense" value={userData.notionUrl} onChange={handleChange} />
                <TextField label="블로그" name="blogUrl" fullWidth margin="dense" value={userData.blogUrl} onChange={handleChange} />

                {/* 포지션 선택 */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>희망 포지션</InputLabel>
                    <Select 
                        name="hopePosition" 
                        value={userData.hopePosition || ""} 
                        onChange={handleChange}
                    >
                        <MenuItem value="BACK">백엔드</MenuItem>
                        <MenuItem value="FRONT">프론트엔드</MenuItem>
                        <MenuItem value="FULLSTACK">풀스택</MenuItem>
                        <MenuItem value="DESIGNER">디자이너</MenuItem>
                    </Select>
                </FormControl>

                {/* 기술 스택 선택 */}
                <Autocomplete
                    multiple
                    options={availableStacks} 
                    value={userData.stackIds}
                    onChange={handleStackChange}
                    getOptionLabel={(option) => option} 
                    renderTags={(value, getTagProps) => value.map((option, index) => (
                        <Chip label={option} {...getTagProps({ index })} key={option} />
                    ))}
                    renderInput={(params) => <TextField {...params} label="기술 스택" placeholder="스택 추가" />}
                />

                {/* 수정 & 취소 버튼 */}
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>저장</Button>
                    <Button variant="outlined" onClick={onClose}>취소</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default MypageEdit;
