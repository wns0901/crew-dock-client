import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ChatWindow = () => {
  
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    // getChatRooms().then((data) => {
    //   setChatRooms(data);
    // });
  }, []);

  const getChatRooms = async () => {
    const data = await axios.get('http://localhost:8080/chat-rooms/{userId}');
  }

  return (
    <ChatWindowModal>
      {/* <CloseBtn onClick={closeWindow}>X</CloseBtn> */}
    </ChatWindowModal>
  );
};

const CloseBtn = styled.button`
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: rgba(0, 0, 0, 0);
    border: none;
  `

const ChatWindowModal = styled.div`
    width: 400px;
    height: 600px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    right: 3%;
    bottom: 12%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `

export default ChatWindow;