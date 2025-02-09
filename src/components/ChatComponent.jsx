import { useContext, useState } from 'react';
import ChatWindow from './ChatWindow';
import { LoginContext } from '../contexts/LoginContextProvider';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';

const ChatComponent = () => {

  const {userInfo, isLogin, roles, projectRoles, logout} = useContext(LoginContext);

  const navigte = useNavigate();

  const [isOpened, setIsOpened] = useState(false);

  const toggleChat = () => {
    setIsOpened(!isOpened);
  };

  const iconStyles = {
    position: 'fixed',
    bottom: '3%',
    right: '3%',
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    cursor: 'pointer',
    height: '30px',
    width: '30px',
  };

  return (
    <>
      {isLogin && <>
      userInfo: {userInfo.id}, {userInfo.username}, {userInfo.nickname} <br/>
      isLogin: {isLogin ? 'true' : 'false'} <br/>
      roles: <br/>
      &nbsp;&nbsp; isAdmin: {roles.isAdmin ? 'true' : 'false'} <br />
      &nbsp;&nbsp; isMember: {roles.isMember ? 'true' : 'false'} <br />

      projectRoles: {projectRoles.map(projectRole => {
        return (
          <div key={projectRole.projectId}>
            프로젝트 id: {projectRole.projectId} <br />
            &nbsp;&nbsp; isCaptain: {projectRole.role.isCaptain ? 'true' : 'false'} <br />
            &nbsp;&nbsp; isCrew: {projectRole.role.isCrew ? 'true' : 'false'} <br />
            &nbsp;&nbsp; isWating: {projectRole.role.isWating ? 'true' : 'false'} <br />
          </div>
        );
      })} <br/>
      </>}

      <button onClick={logout}>로그아웃</button>
      <button onClick={() => navigte('/login')}>로그인</button>

      {isOpened && <ChatWindow />}
      <div onClick={toggleChat}>
      {isOpened ? <KeyboardArrowDownIcon style={iconStyles}/> : <ChatBubbleOutlineIcon style={iconStyles}/>}
      </div>
    </>
  );
};


export default ChatComponent;