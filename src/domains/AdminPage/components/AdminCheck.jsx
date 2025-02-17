import { useContext } from "react";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Navigate } from "react-router-dom";

const AdminCheck = ({ children }) => {
  const { roles } = useContext(LoginContext);

  if (!roles?.isAdmin) {
    return <Navigate to="/" replace />; // 관리자가 아니라면 홈으로 이동
  }

  return children;
};

export default AdminCheck;
