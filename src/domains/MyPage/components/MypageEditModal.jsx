import React, { useContext, useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Modal, IconButton,
    Select, MenuItem, InputLabel, FormControl, Autocomplete, Chip, Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import axios from "axios";
import { Password } from "@mui/icons-material";

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
        stackIds: [],
        selfIntroduction: "",
        profileImgUrl: ""
    });

    const [availableStacks, setAvailableStacks] = useState([]);
    const [stackIdMap, setStackIdMap] = useState(new Map());
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState("");

    useEffect(() => {
        if (!effectiveUserId) return;

        axios.get(`${API_BASE_URL}/user/${effectiveUserId}`)
            .then((response) => {
                setUserData({
                    ...response.data,
                    stackIds: response.data.stacks || [],
                    profileImgUrl: response.data.profileImgUrl || ""
                });
                setPreviewImg(response.data.profileImgUrl || ""); 
            })
            .catch((error) => console.error("❌ 유저 정보 불러오기 실패:", error));

        axios.get(`${API_BASE_URL}/stacks/all`)
            .then((response) => {
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
        setUserData({ ...userData, stackIds: newValue });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    // 🔥 1️⃣ 프로필 이미지 업로드
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("업로드할 이미지를 선택해주세요!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/user/${effectiveUserId}/profile-img`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data.profileImgUrl) {
                setUserData(prev => ({ ...prev, profileImgUrl: response.data.profileImgUrl }));
                setPreviewImg(response.data.profileImgUrl);
                alert("프로필 이미지가 변경되었습니다!");
            } else {
                throw new Error("서버에서 이미지 URL을 반환하지 않음");
            }
        } catch (error) {
            console.error("❌ 프로필 이미지 변경 실패:", error);
            alert("프로필 이미지 변경 중 오류가 발생했습니다.");
        }
    };

    // 🔥 2️⃣ 유저 정보 JSON으로 전송
    const handleSubmit = async () => {
        try {
            const updatedUserData = {
                nickname: userData.nickname,
                phoneNumber: userData.phoneNumber,
                password: userData.password,
                githubUrl: userData.githubUrl,
                notionUrl: userData.notionUrl,
                blogUrl: userData.blogUrl,
                hopePosition: userData.hopePosition,
                selfIntroduction: userData.selfIntroduction,
                profileImgUrl: userData.profileImgUrl,
                stackIds: userData.stackIds.map(stack => stackIdMap.get(stack)).filter(id => id !== undefined),
            };

            const response = await axios.patch(
                `${API_BASE_URL}/user/${effectiveUserId}`,
                updatedUserData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (setUserInfo) {
                setUserInfo(prev => ({ ...prev, ...response.data }));
            }

            alert("회원 정보가 수정되었습니다.");
            onClose();
        } catch (error) {
            console.error("❌ 회원 정보 수정 실패:", error);
            alert("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                width: "400px", maxHeight: "75vh", overflowY: "auto", backgroundColor: "white", padding: 3, borderRadius: 2,
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">프로필 수정</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                {/* 🔥 프로필 이미지 변경 */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Avatar src={previewImg} sx={{ width: 80, height: 80 }} />
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: 10 }} />
                    <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 1 }}>
                        사진 변경
                    </Button>
                </Box>

                <TextField label="이름" fullWidth margin="dense" value={userData.name} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f5f5f5" }} />
                <TextField label="이메일" fullWidth margin="dense" value={userData.username} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f5f5f5" }} />
                <TextField label="닉네임" name="nickname" fullWidth margin="dense" value={userData.nickname} onChange={handleChange} />
                <TextField label="비밀번호" name="password" fullWidth margin="dense" value={userData.password} onChange={handleChange} />
                <TextField label="전화번호" name="phoneNumber" fullWidth margin="dense" value={userData.phoneNumber} onChange={handleChange} />
                <TextField label="한줄소개" name="selfIntroduction" fullWidth margin="dense" value={userData.selfIntroduction} onChange={handleChange} />
                <TextField label="GitHub" name="githubUrl" fullWidth margin="dense" value={userData.githubUrl} onChange={handleChange} />
                <TextField label="notionUrl" name="notionUrl" fullWidth margin="dense" value={userData.notionUrl} onChange={handleChange} />
                <TextField label="blogUrl" name="blogUrl" fullWidth margin="dense" value={userData.blogUrl} onChange={handleChange} />


                <FormControl fullWidth margin="dense">
                    <InputLabel>희망 포지션</InputLabel>
                    <Select name="hopePosition" value={userData.hopePosition || ""} onChange={handleChange}>
                        <MenuItem value="BACK">백엔드</MenuItem>
                        <MenuItem value="FRONT">프론트엔드</MenuItem>
                        <MenuItem value="FULLSTACK">풀스택</MenuItem>
                        <MenuItem value="DESIGNER">디자이너</MenuItem>
                    </Select>
                </FormControl>

                {/* 🔥 기술 스택 선택 추가 */}
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

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>저장</Button>
                    <Button variant="outlined" onClick={onClose}>취소</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default MypageEdit;
