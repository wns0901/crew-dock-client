import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AdminSidebar from "./AdminSidebar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [editingBanner, setEditingBanner] = useState(null);

  // 배너 목록 조회
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error("배너 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 배너 추가
  const handleAddBanner = async () => {
    if (!bannerTitle.trim() || !selectedFile) {
      alert("배너 제목과 이미지를 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "banner",
      new Blob([JSON.stringify({ title: bannerTitle, activate: false })], {
        type: "application/json",
      })
    );
    formData.append("file", selectedFile);

    try {
      await axios.post(`${BASE_URL}/admin/banners`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("배너 추가 실패:", error);
    }
  };

  // 배너 수정
  const handleUpdateBanner = async () => {
    if (!editingBanner) return;

    const formData = new FormData();
    formData.append(
      "banner",
      new Blob([JSON.stringify({ title: bannerTitle })], {
        type: "application/json",
      })
    );
    if (selectedFile) formData.append("file", selectedFile);

    try {
      await axios.put(`${BASE_URL}/admin/banners/${editingBanner.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("배너 수정 실패:", error);
    }
  };

  // 배너 삭제
  const handleDeleteBanner = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${BASE_URL}/admin/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error("배너 삭제 실패:", error);
    }
  };

  // 활성화 상태 변경 (토글)
  const toggleBannerActivation = async (banner) => {
    try {
      await axios.patch(`${BASE_URL}/admin/banners/${banner.id}/activate`, {
        activate: !banner.activate,
      });

      // 로컬 상태 업데이트
      setBanners((prevBanners) =>
        prevBanners.map((b) =>
          b.id === banner.id ? { ...b, activate: !b.activate } : b
        )
      );
    } catch (error) {
      console.error("배너 활성화 상태 변경 실패:", error);
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setBannerTitle("");
    setSelectedFile(null);
    setEditingBanner(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 사이드바 */}
      <AdminSidebar />

      {/* 배너 관리 컨텐츠 */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
        <Typography variant="h4" gutterBottom>
          배너 관리
        </Typography>

        {/* 배너 추가 & 수정 폼 */}
        <Card sx={{ p: 3, mb: 4, width: "100%", maxWidth: 600 }}>
          <TextField
            fullWidth
            label="배너 제목"
            variant="outlined"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginBottom: "16px" }}
          />
          <Button
            variant="contained"
            color={editingBanner ? "warning" : "primary"}
            onClick={editingBanner ? handleUpdateBanner : handleAddBanner}
            sx={{ mt: 2 }}
          >
            {editingBanner ? "배너 수정" : "배너 추가"}
          </Button>
        </Card>

        {/* 배너 목록 */}
        <Grid container spacing={3} sx={{ maxWidth: 1200 }}>
          {banners.map((banner) => (
            <Grid item xs={12} sm={6} md={4} key={banner.id}>
              <Card>
                <CardMedia component="img" height="180" image={banner.url} alt={banner.title} />
                <CardContent>
                  <Typography variant="h6">{banner.title}</Typography>

                  {/* 활성화 상태 토글 버튼 */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <Typography variant="body2">
                      {banner.activate ? "활성화됨" : "비활성화됨"}
                    </Typography>
                    <Switch
                      checked={banner.activate}
                      onChange={() => toggleBannerActivation(banner)}
                      color="primary"
                    />
                  </Box>

                  {/* 수정 & 삭제 버튼 */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        setEditingBanner(banner);
                        setBannerTitle(banner.title);
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      삭제
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminBanner;
