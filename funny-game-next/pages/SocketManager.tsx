// socketManager.ts
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket;

  private constructor() {
    this.socket = io("http://localhost:5000");
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public getSocket(): Socket {
    return this.socket;
  }
}

export default SocketManager;
