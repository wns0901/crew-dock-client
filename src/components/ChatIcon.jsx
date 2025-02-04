import { styled } from 'styled-components';
import React from 'react';


const ChatIcon = ({setIsOpened}) => {

  const openWindow = () => {
    setIsOpened(true);
  }

  return (
    <Icon onClick={openWindow}>
      아이콘
    </Icon>
  );
};

const Icon = styled.div`
    width: 50px;
    height: 50px;
    background-color: gray;
    border-radius: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 3%;
    bottom: 3%;
  `

export default ChatIcon;