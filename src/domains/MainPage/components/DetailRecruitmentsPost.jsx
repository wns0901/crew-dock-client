import React, { useEffect, useState } from "react";
import api from '../../../apis/baseApi';

const DetailRecruitmentsPost = () => {
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        api.get('/recruitments/{recruitmentsId}')
        .then(response => setProjects(response.data.content))
      .catch(error => console.error("데이터 가져오기 실패:", error));
  }, []);

    return (
        <div>
            제목
            닉네임
            작성일
            버튼 2개(채팅하기,신청)
            <hr/>
            모집분야
            진행기간
            지역
            진행방식
            모집인원
            기술스텍
            프로젝트 소개 및 내용
            <hr/>
            
        </div>
    );
};

export default DetailRecruitmentsPost;