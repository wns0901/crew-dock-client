import React from 'react';
import styled from 'styled-components';

const ChatWindow = ({setIsOpened}) => {
  
  const closeWindow = () => {
    setIsOpened(false);
  }

  return (
    <ChatWindowModal>
      <CloseBtn onClick={closeWindow}>X</CloseBtn>
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
    bottom: 3%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `

export default ChatWindow;