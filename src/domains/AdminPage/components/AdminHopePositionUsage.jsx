import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';  // 데이터 라벨 플러그인 추가

// Chart.js 모듈 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminHopePositionUsage = () => {
  const [hopePositionUsageData, setHopePositionUsageData] = useState([]);

  useEffect(() => {
    // axios로 데이터 가져오기 (GET /admin/hopeposition/usage)
    axios.get(`${BASE_URL}/admin/hopeposition/usage`)
      .then(response => {
        setHopePositionUsageData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  // 색상 동적 생성 함수 (HSL 색상 모델을 사용)
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const hue = (i * 360) / num;  // 색상 각도를 균등하게 배분
      const color = `hsl(${hue}, 70%, 60%)`;  // HSL 색상 모델로 색상 생성
      colors.push(color);
    }
    return colors;
  };

  // Doughnut 차트 데이터
  const chartData = {
    labels: hopePositionUsageData.map(position => position.hopePosition),  // 희망 직무 이름들
    datasets: [
      {
        data: hopePositionUsageData.map(position => position.usagePercentage),  // 사용 비율
        backgroundColor: generateColors(hopePositionUsageData.length), // 동적으로 생성된 색상
        hoverBackgroundColor: generateColors(hopePositionUsageData.length), // 호버 색상도 동일하게
        datalabels: {
          display: true,
          formatter: (value) => `${value.toFixed(2)}%`,  // 소수점 2자리로 퍼센트 표시
          color: 'white',  // 텍스트 색상
          font: {
            weight: 'bold',
            size: 14
          }
        }
      }
    ]
  };

  return (
    <div>
      <h2>사용자 희망 포지션 별 차트</h2>
      <div style={{ width: '400px', height: '400px' }}>
        <Doughnut data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default AdminHopePositionUsage;
