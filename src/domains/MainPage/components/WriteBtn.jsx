import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import api from "../../../apis/baseApi";
import ProjectSelectModal from "./ProjectSelectModal";
import ProjectAlertModal from "./ProjectAlertModal"; // Alert 컴포넌트 추가
import { LoginContext } from "../../../contexts/LoginContextProvider"; // 로그인 정보 가져오기

const WriteBtn = () => {
  const { userInfo } = useContext(LoginContext); // 로그인한 사용자 정보 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [captainProjects, setCaptainProjects] = useState([]); // 방장 프로젝트 목록 저장
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.id) return; // 로그인한 사용자가 없으면 실행 X

    api
      .get(`/projects/${userInfo.id}/captain`) // 방장 권한 있는 프로젝트 조회
      .then((response) => {
        console.log("방장인 프로젝트 목록:", response.data);
        setCaptainProjects(response.data);
      })
      .catch((error) => {
        console.error("프로젝트 확인 실패:", error);
        setCaptainProjects([]); 
      });
  }, [userInfo?.id]); // 로그인 정보가 변경될 때마다 실행

  const handleClick = () => {
    if (!userInfo || !userInfo.id) {
      alert("로그인이 필요합니다."); // 로그인 안 했을 때 알림 추가
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    if (captainProjects.length === 0) {
      setIsAlertOpen(true); // 방장 프로젝트가 없으면 Alert 띄우기
      return;
    }

    setIsModalOpen(true); // 방장 프로젝트가 있으면 선택 모달 열기
  };

  return (
    <>
      {/* 로그인된 사용자만 버튼 보이게 조건부 렌더링 */}
      {userInfo && <WriteBtnIcon onClick={handleClick} />}

      {/* 방장 프로젝트 선택 모달 */}
      <ProjectSelectModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        projects={captainProjects}
      />

      {/* 방장 프로젝트 없을 때 Alert 표시 */}
      <ProjectAlertModal open={isAlertOpen} handleClose={() => setIsAlertOpen(false)} />
    </>
  );
};

const WriteBtnIcon = styled(AddIcon)`
  position: fixed;
  bottom: 12%;
  right: 3%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  cursor: pointer;
  display: block;
`;

export default WriteBtn;
