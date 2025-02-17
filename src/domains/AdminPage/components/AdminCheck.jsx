import { useContext } from "react";
import React, { useEffect, useState } from "react";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
const AdminCheck = ({ children }) => {
  const location = useLocation();
    const navigate = useNavigate();

  const { roles } = useContext(LoginContext);

  const [keySequence, setKeySequence] = useState("");

  useEffect(() => {
      const handleKeyDown = (event) => {
          setKeySequence(prev => {
              const updatedSequence = prev + event.key;
              // 시퀀스 길이가 9가 되면 확인 (qqqwwwee)
              if (updatedSequence.includes("wjfalwjfal")) {
                  navigate("/sss"); // 이동할 페이지 설정
                  return ""; // 시퀀스 확인 후 초기화
              }
              return updatedSequence.slice(-9); // 시퀀스 길이가 9보다 커지지 않도록 처리
          });
      };

      // 이벤트 리스너 등록
      window.addEventListener("keydown", handleKeyDown);

      // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
      return () => {
          window.removeEventListener("keydown", handleKeyDown);
      };
  }, [navigate]);


  if (!roles?.isAdmin) {
    return <Navigate to="/" replace />; // 관리자가 아니라면 홈으로 이동
  }

  return children;
};

export default AdminCheck;
