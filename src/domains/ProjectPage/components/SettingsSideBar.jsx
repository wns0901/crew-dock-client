import React from "react";
import {
  Box,
  Button,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const SettingsSideBar = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [navValue, setNavValue] = React.useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 2,
      }}
    >
      {/* 🔹 상단 프로젝트로 돌아가기 버튼 */}
      <Box sx={{ marginBottom: "auto", textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/projects/${projectId}`)}
          fullWidth
        >
          프로젝트로 돌아가기
        </Button>
      </Box>

      {/* 🔹 하단 네비게이션 */}
      <BottomNavigation
        sx={{
          backgroundColor: "#f4f4f4",
          borderTop: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 2,
        }}
        showLabels
        value={navValue}
        onChange={(event, newValue) => {
          setNavValue(newValue);
          if (newValue === 0) navigate(`/projects/${projectId}/settings`);
          if (newValue === 1) navigate(`/projects/${projectId}/manage`);
          if (newValue === 2) navigate(`/projects/${projectId}/pending`);
        }}
      >
        <BottomNavigationAction label="세부 사항" />
        <BottomNavigationAction label="엑세스" />
        <BottomNavigationAction label="신청 관리" />
      </BottomNavigation>
    </Box>
  );
};

export default SettingsSideBar;
