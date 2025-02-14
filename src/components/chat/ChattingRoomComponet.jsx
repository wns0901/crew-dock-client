import styled from "styled-components";
import { Button } from "@mui/material";
import chat from "../../apis/chat/chat";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import SettingsIcon from "@mui/icons-material/Settings";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { sendMessage } from "../../containers/userSocketStatusSlice";
import React, { useContext, useEffect, useRef, useState } from "react";
import {useKeyEscClose} from "../../hooks/useKeyEscClose";

const ChattingRoomComponet = ({ chatRoom, setSelectedRoom }) => {
  const { userInfo } = useContext(LoginContext);

  const dispath = useDispatch();
  const dividerRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageList, setMessageList] = useState([]);
  const [sendMessageText, setSendMessage] = useState("");
  const reciveMessage = useSelector((state) => state.userSocketStatus.message);
  const inputRef = useRef(null);


  const divStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    if (dividerRef.current) {
      const dividerPosition = dividerRef.current.offsetTop;
      messageContainerRef.current.scrollTop = dividerPosition - 300;
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    chat
      .enterChatRoom(chatRoom.id, userInfo.nickname)
      .then((chatMessages) => {
        setMessageList(chatMessages);
      })
      .catch((error) => {
        alert("메세지를 불러오는데 실패했습니다.");
        setSelectedRoom(null);
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });

    inputRef.current.focus();

    return () => {
      chat
        .leaveChatRoom(chatRoom.id, userInfo.nickname)
        .then((res) => setSelectedRoom(null));
    };
  }, []);

  useEffect(() => {
    if (!reciveMessage) return;

    setMessageList([...messageList, reciveMessage]);
  }, [reciveMessage]);

  const sendMessageHandler = () => {
    const message = {
      msg: sendMessageText,
      sender: userInfo.nickname,
    };

    setSendMessage("");

    dispath(sendMessage({ message, roomId: chatRoom.id }));
  };

  const inputSendMessage = (e) => {
    setSendMessage(e.target.value);
  };

  const enterEvent = (e) => {
    if (e.key === "Enter") {
      if (sendMessageText.trim() === "") {
        setSendMessage("");
        return;
      } else {
        sendMessageHandler();
      }
    }

    if (e.key === "ESC") {
      closeChatRoom();
    }
  };

  const closeChatRoom = () => {
    setSelectedRoom(null);
  };

  useKeyEscClose(closeChatRoom);

  return (
    <Container>
      <ContainerHeader>
        <CustomSettingIcon />
        <ChatRoomName>{chatRoom.roomName}</ChatRoomName>
        <CustomCloseIcon onClick={() => setSelectedRoom(null)} />
      </ContainerHeader>
      <MessageContainer ref={messageContainerRef}>
        {isLoading ? (
          <LoadingWrapper>
            <CircularProgress />
          </LoadingWrapper>
        ) : (
          messageList.map((message) => {
            return (
              <div key={message.id}>
                {message.isRead && (
                  <>
                    <br /> <Divider ref={dividerRef}>여기까지 읽음</Divider>{" "}
                    <br />
                  </>
                )}
                {message.sender === userInfo.nickname ? (
                  <MyChatContainer>
                    <div style={divStyle}>
                      <MyChatTime>{message.createdAt}</MyChatTime>
                      <MyChatting>{message.msg}</MyChatting>
                    </div>
                  </MyChatContainer>
                ) : (
                  <OtherChatContainer>
                    <NicknameP>{message.sender}</NicknameP>
                    <div style={divStyle}>
                      <OtherChatting>{message.msg}</OtherChatting>
                      <OtherChatTime>{message.createdAt}</OtherChatTime>
                    </div>
                  </OtherChatContainer>
                )}
              </div>
            );
          })
        )}
      </MessageContainer>
      <InputDiv>
        <MessageInput
          placeholder="메세지 전송"
          value={sendMessageText}
          onChange={inputSendMessage}
          onKeyUp={enterEvent}
          ref={inputRef}
        />
        <SendBtn variant="contained" onClick={sendMessageHandler}>
          전송
        </SendBtn>
      </InputDiv>
    </Container>
  );
};

const ChatRoomName = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const InputDiv = styled.div`
  position: absolute;
  bottom: 16px;
  box-sizing: content-box;
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
`;

const MessageInput = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 70%;
  border: none;
  outline: none;
  resize: none;
  padding: 10px;
  font-size: 1.2em;
  &:focus {
    outline: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SendBtn = styled(Button)`
  width: 15%;
  height: 30%;
  position: absolute;
  left: 80%;
  bottom: 0;
`;

const chatTimeStyle = `
  color: #666;
  font-size: 0.7em; 
  margin-bottom: 15px;
`;

const MyChatTime = styled.span`
  ${chatTimeStyle}
  float: right;
  margin-right: 7px;
`;

const OtherChatTime = styled.span`
  ${chatTimeStyle}
  float: left;
  margin-left: 7px;
`;

const CustomCloseIcon = styled(CloseIcon)``;

const CustomSettingIcon = styled(SettingsIcon)``;

const MessageContainer = styled.div`
  width: 100%;
  height: 67%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;

const MyChatting = styled.div`
  background-color: #1967fe;
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
  right: 5px;
  align-self: flex-end;
  color: white;
  float: right;
`;

const OtherChatting = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  margin-left: 10px;
  margin-bottom: 15px;
  align-self: flex-start;
  float: left;
  width: max-content;
`;

const OtherChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  float: left;
  margin-left: 10px;
`;

const MyChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  float: right;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContainerHeader = styled.div`
  box-sizing: border-box;
  width: 90%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const NicknameP = styled.span`
  margin-left: 10px;
  font-size: 0.8em;
  color: #333;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #666;
  font-size: 12px;
  margin: 10px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

export default ChattingRoomComponet;
