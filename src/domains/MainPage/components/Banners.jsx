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
                    <Box key={banner.id} sx={{ width: "100%", height: "200px", backgroundColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
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
