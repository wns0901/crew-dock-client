import React from "react";
import AdminStackUsage from "./AdminStackUsage"; // 스택 사용 비율 차트
import AdminHopePositionUsage from "./AdminHopePositionUsage"; // 희망 직무 사용 비율 차트
import AdminSidebar from "./AdminSidebar"; // 사이드바
import { Box } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 사이드바 */}
      <AdminSidebar />

      {/* 대시보드 컨텐츠 */}
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: 1200 }}>
          <Box sx={{ width: "45%", minWidth: 300, margin: 2 }}>
            <AdminStackUsage />
          </Box>
          <Box sx={{ width: "45%", minWidth: 300, margin: 2 }}>
            <AdminHopePositionUsage />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
