import api from "../baseApi";

export default {
  getChatRooms: async (userId) => {
    
    const response = await api.get(`/chat-rooms/${userId}`).catch((error) => {
      alert("채팅방 목록을 불러오는데 실패했습니다.");
    });
    
    return response.data;
  },

  enterChatRoom: async (roomId, nickname) => {
    const params = { nickname, roomId };
    const headers = { 
        'Cache-Control': 'no-store',
        Pragma: 'no-store',
        Expires: '0',
      }
      
    const response = await api.get(`/chat-messages`, { params, headers });
    return response.data;
  },

  leaveChatRoom: async (roomId, nickname) => {
    await api.patch(`/chat-rooms/${roomId}/${nickname}`);
    return true;
  },

  makeChatRoom: async (senderId, receiverId) => {
    const response = await api.post(`/chat-rooms`, { senderId, receiverId });
    return response.data;
  },

  deleteChatRoom: async (roomId) => {
    await api.delete(`/chat-rooms/${roomId}`);
    return true;
  },

  changeRoomName: async (roomId, roomName) => {    
    await api.patch(`/chat-rooms/${roomId}`, {roomName});
    return true;
  }
};
