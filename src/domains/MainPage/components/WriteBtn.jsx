import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import api from "../../../apis/baseApi";
import ProjectSelectModal from "./ProjectSelectModal";
import ProjectAlertModal from "./ProjectAlertModal";
import { LoginContext } from "../../../contexts/LoginContextProvider"; // 로그인 정보 가져오기

const WriteBtn = () => {
  const { userInfo } = useContext(LoginContext); // 로그인한 사용자 정보 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [hasProjects, setHasProjects] = useState(false); // 기본값을 false로 설정
  const [captainProjects, setCaptainProjects] = useState([]); // 방장 프로젝트 목록 저장
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.id) return; // 로그인한 사용자가 없으면 실행 X

    api
      .get(`/projects/${userInfo.id}/captain`) // 방장 권한 있는 프로젝트 조회
      .then((response) => {
        console.log("방장인 프로젝트 목록:", response.data);
        setCaptainProjects(response.data);
        setHasProjects(response.data.length > 0); // 방장인 프로젝트가 1개 이상이면 true
      })
      .catch((error) => console.error("프로젝트 확인 실패:", error));
  }, [userInfo?.id]); // 로그인 정보가 변경될 때마다 실행

  const handleClick = () => {
    if (hasProjects) {
      setIsModalOpen(true); // 방장 프로젝트가 있으면 선택 모달 열기
    } else {
      setIsAlertOpen(true); // 방장 프로젝트가 없으면 알림창 열기
    }
  };

  return (
    <>
      <WriteBtnIcon onClick={handleClick} />
      {/* 방장 프로젝트 선택 모달 */}
      <ProjectSelectModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        projects={captainProjects} // 방장 프로젝트 목록 전달
      />
      {/* 방장 프로젝트 없을 때 알림 모달 */}
      <ProjectAlertModal
        open={isAlertOpen}
        handleClose={() => setIsAlertOpen(false)}
      />
    </>
  );
};

const WriteBtnIcon = styled(AddIcon)`
  position: fixed;
  bottom: 9%;
  right: 3%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  cursor: pointer;
  display: block;
`;

export default WriteBtn;
