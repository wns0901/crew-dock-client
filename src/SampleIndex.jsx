import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./contexts/LoginContextProvider"; 
import { makeChatRoom } from "./containers/userSocketStatusSlice"; 

const SampleIndex = () => {
  const navigte = useNavigate();
  const [inviteId, setInviteId] = useState("");

  const { userInfo, isLogin, roles, projectRoles, logout, loginCheck } =
    useContext(LoginContext);

  const dispath = useDispatch();

  const makeChatRoomEvent = () => {
    dispath(makeChatRoom({ senderId: userInfo.id, receiverId: inviteId }));
  };

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <div>
      {isLogin && (
        <>
          userInfo: {userInfo.id}, {userInfo.username}, {userInfo.nickname}{" "}
          <br />
          isLogin: {isLogin ? "true" : "false"} <br />
          roles: <br />
          &nbsp;&nbsp; isAdmin: {roles.isAdmin ? "true" : "false"} <br />
          &nbsp;&nbsp; isMember: {roles.isMember ? "true" : "false"} <br />
          projectRoles:{" "}
          {projectRoles.map((projectRole) => {
            return (
              <div key={projectRole.projectId}>
                프로젝트 id: {projectRole.projectId} <br />
                &nbsp;&nbsp; isCaptain:{" "}
                {projectRole.role.isCaptain ? "true" : "false"} <br />
                &nbsp;&nbsp; isCrew:{" "}
                {projectRole.role.isCrew ? "true" : "false"} <br />
                &nbsp;&nbsp; isWating:{" "}
                {projectRole.role.isWating ? "true" : "false"} <br />
              </div>
            );
          })}{" "}
          <br />
          <input
            type="text"
            placeholder="초대할 사람 id"
            value={inviteId}
            onChange={(e) => setInviteId(e.target.value)}
          />
          <button onClick={makeChatRoomEvent}>채팅방 만들기</button> <br />
        </>
      )}
      <button onClick={logout}>로그아웃</button>
      <button onClick={() => navigte("/login")}>로그인</button>
    </div>
  );
};

export default SampleIndex;
