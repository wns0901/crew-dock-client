import React, { useState } from "react";
import styled from "styled-components";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatSettingComponent from "./ChatSettingComponent";

const ChatRoomCard = ({ chatRoom }) => {
  const [openModal, setOpenModal] = useState(false);

  const settingIconStyle = {
    position: "absolute",
    bottom: "16px",
    right: "16px",
  };

  const openSettingModal = (e) => {
    e.stopPropagation();
    setOpenModal(!openModal);
  };

  

  return (
    <Card>
      <div>
        <RoomName>{chatRoom.roomName}</RoomName>
        <UserCnt>({chatRoom.userCnt})</UserCnt>
      </div>
      <p>{chatRoom.lastMessage.msg}</p>
      <SettingsIcon style={settingIconStyle} onClick={openSettingModal}/>
      {chatRoom.isRead === false && <ChatRoomAlam />}
      {openModal && <ChatSettingComponent roomId={chatRoom.id} setOpenModal={setOpenModal} />}
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  position: relative;
  flex-direction: column;
  width: 80%;
`;

const RoomName = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const UserCnt = styled.span`
  font-size: 1em;
  color: #666;
  margin: 0 3px 0;
`;

const ChatRoomAlam = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

export default ChatRoomCard;
