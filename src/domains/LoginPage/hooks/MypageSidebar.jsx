import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import Chip from "@mui/material/Chip";
import GitHubIcon from "@mui/icons-material/GitHub";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog, faCog } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import MypageEditModal from "./MypageEditModal";

const MypageSidebar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // ✅ 현재 페이지면 굵게 표시하는 함수
    const isActive = (path) => location.pathname === path;

    const handleSave = (updatedUser) => {
        console.log("수정된 유저 정보:", updatedUser);
        setIsEditModalOpen(false);
    };

    return (
        <Box sx={{ mt: 1, width: "250px", backgroundColor: "#f4f4f4", padding: "25px", borderRight: "1px solid #ccc", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", top: 0, left: 0 }}>
            {/* 프로필 사진 */}
            <Avatar sx={{ width: 100, height: 100, mb: 2, backgroundColor: "#ddd" }}>
                {user?.nickname?.charAt(0) || "?"}
            </Avatar>

            {/* 사용자 정보 */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 2, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name || "사용자"} ({user?.nickname || "닉네임 없음"})
                </Typography>
                <IconButton onClick={() => setIsEditModalOpen(true)}>
                    <FontAwesomeIcon icon={faCog} />
                </IconButton>
            </Box>

            {/* 포지션 & 한줄 소개 */}
            <Typography variant="subtitle2" sx={{ textAlign: "center", width: "100%", color: "gray", ml: 2 }}>
                {user?.hopePosition || "포지션(미등록)"}
            </Typography>
            <Typography sx={{ textAlign: "center", width: "100%", mt: 2, fontSize: 14, color: "gray", ml: 2 }}>
                {user?.selfIntroduction || "한줄 소개가 없습니다."}
            </Typography>

            {/* 기술 스택 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "left", mt: 2, width: "100%", ml: 2 }}>
                {user?.stacks && user.stacks.length > 0 ? (
                    user.stacks.map((stack, index) => (
                        <Chip key={index} label={`#${stack}`} size="small" variant="outlined" />
                    ))
                ) : (
                    <Typography sx={{ textAlign: "center", width: "100%", color: "gray" }}>미등록</Typography>
                )}
            </Box>

            {/* URL 아이콘 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                {user?.githubUrl && (
                    <IconButton onClick={() => window.open(user.githubUrl, "_blank")}>
                        <GitHubIcon fontSize="medium" />
                    </IconButton>
                )}
                {user?.notionUrl && (
                    <IconButton onClick={() => window.open(user.notionUrl, "_blank")}>
                        <DesignServicesIcon fontSize="medium" />
                    </IconButton>
                )}
                {user?.blogUrl && (
                    <IconButton onClick={() => window.open(user.blogUrl, "_blank")}>
                        <FontAwesomeIcon icon={faBlog} size="lg" />
                    </IconButton>
                )}
            </Box>

            {/* 네비게이션 */}
            <Box sx={{ mt: 3, width: "100%" }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={isActive("/mypage") ? "bold" : "normal"}
                    sx={{ mb: 1, textAlign: "left", ml: 2, cursor: "pointer" }}
                    onClick={() => navigate("/mypage")}
                >
                    마이페이지
                </Typography>

                <Typography
                    sx={{
                        textAlign: "left",
                        color: isActive("/mypage/posts") ? "black" : "gray",
                        fontWeight: isActive("/mypage/posts") ? "bold" : "normal",
                        mb: 1,
                        ml: 4,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/mypage/posts")}
                >
                    작성 글
                </Typography>

                <Typography
                    sx={{
                        textAlign: "left",
                        color: isActive("/mypage/portfolios") ? "black" : "gray",
                        fontWeight: isActive("/mypage/portfolios") ? "bold" : "normal",
                        mb: 1,
                        ml: 4,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/mypage/portfolios")}
                >
                    포트폴리오
                </Typography>

                <Typography
                    sx={{
                        textAlign: "left",
                        color: isActive("/mypage/scraps") ? "black" : "gray",
                        fontWeight: isActive("/mypage/scraps") ? "bold" : "normal",
                        mb: 1,
                        ml: 4,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/mypage/scraps")}
                >
                    스크랩
                </Typography>

                <Typography
                    sx={{
                        textAlign: "left",
                        color: isActive("/mypage/projects") ? "black" : "gray",
                        fontWeight: isActive("/mypage/projects") ? "bold" : "normal",
                        ml: 4,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/mypage/projects")}
                >
                    프로젝트
                </Typography>
            </Box>

            <MypageEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} onSave={handleSave} />
        </Box>
    );
};

export default MypageSidebar;
