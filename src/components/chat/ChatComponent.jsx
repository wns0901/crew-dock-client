import ChatWindow from "./ChatWindow";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ChatComponent = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const reciveMessage = useSelector((state) => state.userSocketStatus.message);
  const { isLogin } = useContext(LoginContext);

  useEffect(() => {
    setNewMessage(!!reciveMessage);
  }, [reciveMessage]);

  const toggleChat = () => {
    setIsOpened(!isOpened);
  };

  return (
    <>
      {isOpened && <ChatWindow setNewMessage={setNewMessage} setIsOpened={setIsOpened} />}
      {isLogin && (<div onClick={toggleChat}>
        {isOpened ? <CloseChatIcon /> : <ChatIcon></ChatIcon>}
        {!isOpened && newMessage && <RedPoint />}
      </div>)}
    </>
  );
};

const IconStyles = `
  position: fixed;
  bottom: 3%;
  right: 3%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  cursor: pointer;
  display: block;
`;

const ChatIcon = styled(ChatOutlinedIcon)`
  ${IconStyles}
`;

const CloseChatIcon = styled(KeyboardArrowDownIcon)`
  ${IconStyles}
`;

const RedPoint = styled.div`
  position: fixed;
  bottom: 3%;
  right: 3%;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

export default ChatComponent;
