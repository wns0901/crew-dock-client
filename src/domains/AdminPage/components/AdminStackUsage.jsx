import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';  // 데이터 라벨 플러그인 추가
import AdminSidebar from "./AdminSidebar";
// Chart.js 모듈 등록
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminStackUsage = () => {
  const [stackUsageData, setStackUsageData] = useState([]);

  useEffect(() => {
    // axios로 데이터 가져오기 (GET /admin/stacks/usage)
    axios.get(`${BASE_URL}/admin/stacks/usage`)
      .then(response => {
        setStackUsageData(response.data);
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

  // Bar 차트 데이터
  const chartData = {
    labels: stackUsageData.map(stack => stack.stackName),  // 스택 이름들
    datasets: [
      {
        label: '스택 사용 비율',
        data: stackUsageData.map(stack => stack.usagePercentage),  // 사용 비율
        backgroundColor: generateColors(stackUsageData.length), // 동적으로 생성된 색상
        hoverBackgroundColor: generateColors(stackUsageData.length), // 호버 색상도 동일하게
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
      <h2>기술 스택 사용률 차트</h2>
      <div style={{ width: '100%', height: '400px' }}>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default AdminStackUsage;
