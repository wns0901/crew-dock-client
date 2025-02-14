import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const WriteBtn = () => {
    const navigate = useNavigate();

    

    const onWriteBtn = () => {
        navigate('/recruitmemt/write')
    };

    return (
        <>
          <WriteBtnIcon onClick={onWriteBtn}/>  
        </>
    );
};

const WriteBtnIcon = styled(AddIcon)`
    position: fixed;
  bottom: 9%;
  right: 3%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  cursor: pointer;
  display: block;
`;

export default WriteBtn;