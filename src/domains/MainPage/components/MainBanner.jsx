import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../../apis/baseApi";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MainBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get(`/admin/banners`);
        const activeBanners = response.data.filter((banner) => banner.activate);
        setBanners(activeBanners);
      } catch (error) {
        console.error("메인 배너 불러오기 실패:", error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true, // 하단 네비게이션 점 표시
    infinite: true, // 무한 루프
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한 번에 하나의 배너만 표시
    slidesToScroll: 1, // 하나씩 넘기기
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 3초마다 변경
    arrows: true, // 좌우 화살표 표시
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", margin: "0 auto", mt: 5 }}>
      {banners.length > 0 ? (
        <Slider {...settings}>
          {banners.map((banner) => (
            <Card key={banner.id} sx={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="450"
                image={banner.url}
                alt={banner.title}
                sx={{ objectFit: "cover" }}
                
              />
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  padding: "8px 16px",
                }}
              >
               
              </Typography>
            </Card>
          ))}
        </Slider>
      ) : (
        <Typography variant="h6" textAlign="center">
          현재 표시할 배너가 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default MainBanner;
