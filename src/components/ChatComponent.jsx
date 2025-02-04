import { useState } from 'react';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

const ChatComponent = () => {

  const [isOpened, setIsOpened] = useState(false);

  const toggleChat = () => {
    setIsOpened(!isOpened);
  };

  return (
    <>
    asdsa
      <div >
    
      {isOpened ? <ChatWindow setIsOpened={setIsOpened}/> : <ChatIcon setIsOpened={setIsOpened}/>}
      </div>
    </>
  );
};

export default ChatComponent;