import React, { useEffect, useState } from 'react';
import api from '../../../apis/baseApi';
import { Box, Typography } from '@mui/material';

const Banners = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('/banners');
                const activeBanners = response.data.filter(banner => banner.active); // active가 true인 배너만 필터링
                setBanners(activeBanners);
            } catch (error) {
                console.error('배너 불러오기 오류:', error);
            }
        };

        fetchBanners();
    }, []);

    return (
        <div>
            {banners.length > 0 ? (
                banners.map((banner) => (
                    <Box key={banner.id} 
                        sx={{
                            width: "80%",
                            maxWidth: "1200px",
                            height: "180px",
                            backgroundColor: "#EAF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "20px", // 둥근 모서리 적용
                            padding: "20px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            textAlign: "center"
                        }}>
                        <Typography variant="h4">{banner.name}</Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="h6">활성화된 배너가 없습니다.</Typography>
            )}
        </div>
    );
};

export default Banners;
