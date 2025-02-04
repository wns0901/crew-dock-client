import { styled } from 'styled-components';
import React from 'react';


const ChatIcon = () => {

  const Icon = styled.div`
    width: 100px;
    height: 100px;
    background-color: gray;
    border-radius: 50%;
  `

  return (
    <Icon>
      아이콘
    </Icon>
  );
};

export default ChatIcon;