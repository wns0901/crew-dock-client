import styled from "styled-components";
import chat from "../../apis/chat/chat";
import ChatRoomCard from "./ChatRoomCard";
import ChattingRoomComponet from "./ChattingRoomComponet";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { useSelector, useDispatch } from "react-redux";
import { setChatRooms } from "../../containers/userSocketStatusSlice";
import { useKeyEscClose } from "../../hooks/useKeyEscClose";

const ChatWindow = ({ setNewMessage, setIsOpened }) => {
  const { userInfo } = useContext(LoginContext);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const reciveMessage = useSelector((state) => state.userSocketStatus.message);
  const chatRooms = useSelector((state) => state.userSocketStatus.chatRooms);
  const dispath = useDispatch();

  useEffect(() => {
    return () => {
      chat.getChatRooms(userInfo.id).then((chatRooms) => {
        if (chatRooms.length === 0) {
          setNewMessage(false);
          return;
        }
        setNewMessage(!chatRooms.some((chatRoom) => chatRoom.isRead));
      });
    };
  }, []);

  useEffect(() => {    
    if (selectedRoom) return;
    getChatRooms().then((chatRooms) => {
      dispath(setChatRooms(chatRooms));
    });
  }, [selectedRoom]);

  useEffect(() => {
    if (!reciveMessage) return;
    
    getChatRooms().then((chatRooms) => {
      dispath(setChatRooms(chatRooms));
    });
  }, [reciveMessage]);

  const getChatRooms = async () => {
    return await chat.getChatRooms(userInfo.id);
  };

  return (
    <ChatWindowModal>
      {selectedRoom ? (
        <ChattingRoomComponet
          chatRoom={chatRooms.find((chatRoom) => chatRoom.id === selectedRoom)}
          setSelectedRoom={setSelectedRoom}
        />
      ) : (
        <>
        <ChatTiltle>채팅</ChatTiltle>
        {chatRooms.map((chatRoom) => (
          <div
            key={chatRoom.id}
            onClick={() => {
              setSelectedRoom(chatRoom.id);
            }}
            >
            <ChatRoomCard chatRoom={chatRoom} />
          </div>
        ))}
        </>
      )
      }
    </ChatWindowModal>
  );
};

const ChatTiltle = styled.h2`
  text-align: center;
`;

const ChatWindowModal = styled.div`
  width: 400px;
  height: 600px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  right: 3%;
  bottom: 10%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

export default ChatWindow;
