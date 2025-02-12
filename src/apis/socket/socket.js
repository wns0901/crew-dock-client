import io from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default {

  socket: io(BASE_URL + '/chat', {transports: ['websocket']}),

  callbackMap: new Map(),

  initConnection() {
    if(this.socket) return;
    this.socket.connect
  },

  sendMessage(message) {

    if(!this.socket || !this.socket.connected) {
      this.initConnection();
    }

    this.socket.emit('send', message);
  },

  onMessageReceived(callbackType , callback) {
    this.callbackMap.set(callbackType, callback);

    if (this.socket.hasListeners('message')) this.socket.off('message')

    this.socket.on("message", data => {
      for(let [_, callback] of this.callbackMap) {
        callback(null, data);
      }
    });
  },

  disconnect() {
    if(!this.socket || !this.socket.connected) return;

    this.socket.disconnect();
    this.socket = null;
  },

}