import React from 'react';
import api from '../../../apis/baseApi'

const Banners = () => {

    const res = api.get('/recruitments');

    const data = {
        name: "",
    };

    const postRes = api.post('/recruitments', data);
    
    return (
        <div>
           배너
           {/* <Box sx={{ width: "100%", height: "200px", backgroundColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h4">인프메이션 배너</Typography>
            </Box> */}
        </div>
    );
};

export default Banners;