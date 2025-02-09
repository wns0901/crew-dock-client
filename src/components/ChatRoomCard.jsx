import React from 'react';
import styled from 'styled-components';

const ChatRoomCard = ({
  roomName,
  userCnt
}) => {

  return (
    <Card>
      <RoomName>{roomName}</RoomName>
      <UserCnt>({userCnt})</UserCnt>
    </Card>
  );
};


const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoomName = styled.h2`
  font-size: 1.5em;
  margin: 0;
  color: #333;
`;

const UserCnt = styled.p`
  font-size: 1em;
  color: #666;
  margin: 8px 0 0;
`;

export default ChatRoomCard;