import { useState } from 'react';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

const ChatConpent = () => {

  const [isOpened, setIsOpened] = useState(false);

  const toggleChat = () => {
    setIsOpened(!isOpened);
  };

  return (
    <>
    asdsa
      <div onClick={toggleChat}>
    
      {isOpened ? <ChatWindow /> : <ChatIcon />}
      </div>
    </>
  );
};

export default ChatConpent;