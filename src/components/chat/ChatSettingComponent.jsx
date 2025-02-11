import React, { createRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatRooms } from "../../containers/userSocketStatusSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  List,
  ListItem,
  MenuItem,
  Paper,
} from "@mui/material";
import chat from "../../apis/chat/chat";

const ChatSettingComponent = ({ roomId, setOpenModal }) => {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.userSocketStatus.chatRooms);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    chat.changeRoomName(roomId, newRoomName).then(() => {
      dispatch(
        setChatRooms(
          chatRooms.map((chatRoom) => {
            if (chatRoom.id === roomId) {
              return { ...chatRoom, roomName: newRoomName };
            }
            return chatRoom;
          })
        )
      );
    });
    setOpen(false);
    setOpenModal(false);
  };

  const handleRoomNameChange = (event) => {
    setNewRoomName(event.target.value);
  };

  const clickEnterHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(e);
    }
  };

  const handleCloseDelete = (e) => {
    e.stopPropagation();
    setOpenDelete(false);
    setOpenModal(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    chat.deleteChatRoom(roomId).then(() => {
      dispatch(
        setChatRooms(chatRooms.filter((chatRoom) => chatRoom.id !== roomId))
      );
    });
    setOpenModal(false);
    setOpenDelete(false);
  };

  const paperStyle = {
    position: 'absolute',
        top: '90%',  // 부모 요소 바로 아래에 위치
        right: '5%',     // 오른쪽 정렬
        zIndex: 1000, // 다른 요소들 위에 표시
        minWidth: '150px', // 최소 너비 설정
  };

  const nameModalHandler = (e) => {
    e.stopPropagation();
    setOpen(!open);
  }

  const deleteModalHandler = (e) => {
    e.stopPropagation();
    setOpenDelete(!openDelete);
  }


  return (
    <div>
      <Paper elevation={0} variant="outlined" sx={paperStyle}>
        <List sx={{ p: 0 }}>
          <MenuItem onClick={nameModalHandler}>채팅방 이름 변경</MenuItem>
          <MenuItem
            onClick={deleteModalHandler}
            sx={{ color: "error.main" }}
          >
            삭제
          </MenuItem>
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>채팅방 이름 변경</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="새 채팅방 이름"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={handleRoomNameChange}
            onKeyDown={clickEnterHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>채팅방 삭제</DialogTitle>
        <DialogContent>정말로 이 채팅방을 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>취소</Button>
          <Button onClick={handleDelete}>삭제</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatSettingComponent;
