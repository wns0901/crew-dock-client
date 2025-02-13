import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chat from "../apis/chat/chat";

const BASE_URL = import.meta.env.VITE_BASE_URL;
let stompClient = null;

const createSockJSInstance = () => {
  return new SockJS(`${BASE_URL}/chat`);
};

export const subribeRoom = createAsyncThunk('userSocketStatus/subscribeRoom', async (roomId, { dispatch }) => {
  await new Promise((resolve, reject) => {
    if (stompClient) {
      stompClient.subscribe(`/sub/room/${roomId}`, (message) => {
        dispatch(setMessages(JSON.parse(message.body)));
      });
      resolve();
    }
    reject();
  });

});

export const connectWebSocket = createAsyncThunk(
  "userSocketStatus/connect",
  async ({roomIds, userId}, { dispatch }) => {
    if (stompClient) return;
    
    stompClient = Stomp.over(createSockJSInstance());

    

    await new Promise((resolve, reject) => {
      stompClient.connect(
        {},
        () => {          
          roomIds.split(",").forEach((roomId) => {
            stompClient.subscribe(`/sub/room/${roomId}`, (message) => {
              dispatch(setMessages(JSON.parse(message.body)));
            });
          });

          stompClient.subscribe(`/sub/user/${userId}`, (message) => {
            const {roomId} = JSON.parse(message.body);
            
            const cachRoomIds = JSON.parse(localStorage.getItem("chatRoomIds"));
            const arr = cachRoomIds.split(",");
            arr.push(`${roomId}`);
            localStorage.setItem("chatRoomIds", JSON.stringify(arr.join(",")));
            dispatch(setMessages({roomId, msg: "채팅방이 생성되었습니다."}));
            dispatch(subribeRoom(roomId));
          });

          resolve();
        },
        reject()
      );
    });
  }
);

export const makeChatRoom = createAsyncThunk(
  "userSocketStatus/makeChatRoom",
  async ({ senderId, receiverId }, { dispatch }) => {
    await new Promise(async (resolve, reject) => {
      if (stompClient) {
        const roomInfo = await chat.makeChatRoom(senderId, receiverId);
        
        stompClient.send(`/pub/user/${receiverId}`, {}, JSON.stringify({ id: roomInfo.id }));

        const cachRoomIds = JSON.parse(localStorage.getItem("chatRoomIds"));
        const arr = cachRoomIds.split(",");
        arr.push(`${roomInfo.id}`);
        localStorage.setItem("chatRoomIds", JSON.stringify(arr.join(",")));
        
        dispatch(subribeRoom(roomInfo.id));
        resolve();
      }
      reject();
    });
  }
);

const userSocketStatusSlice = createSlice({
  name: "userSocketStatus",
  initialState: { message: null, chatRooms: [] },
  reducers: {
    setMessages: (state, action) => {
      state.message = action.payload;
    },

    sendMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (stompClient) {
        stompClient.send(`/pub/room/${roomId}`, {}, JSON.stringify(message));
      }
    },

    cleanMessage: (state) => {
      state.message = null;
    },

    disconnect: (state) => {
      if (stompClient) {
        stompClient.disconnect();
        stompClient = null;
      }
    },

    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
    }
  },
});

export const { setMessages, sendMessage, cleanMessage, disconnect, inviteRoom, setChatRooms} =
  userSocketStatusSlice.actions;
export default userSocketStatusSlice.reducer;
