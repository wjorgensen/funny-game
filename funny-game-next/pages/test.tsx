import { Inter } from 'next/font/google'
import s from "./index.module.scss"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(
      "http://localhost:5000"
    );
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('roomCreated', (data: { roomId: string }) => {
      console.log('Room created:', data);
      setRoomId(data.roomId);
    });

    newSocket.on('joinedRoom', (data: { roomId: string; name: string }) => {
      console.log('Joined room:', data);
      setName(data.name);
      setConnectedUsers((prevUsers) => [...prevUsers, data.name]);
    });

    newSocket.on('roomNotFound', () => {
      console.log('Room not found');
    });

    newSocket.on('roomStarted', () => {
      console.log('Room started');
    });

    newSocket.on('roundEnded', (i) => {
      console.log('The ' + i + ' round has ended');
    });

    newSocket.on('updatePlayers', (data: string[]) => {
        console.log('Updated players:', data);
      setConnectedUsers(data);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the socket connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Run once on component mount

  const joinRoom = () => {
    const enteredRoomId = prompt('Enter room ID:');
    const enteredName = prompt('Enter your name:');
    if (socket && enteredRoomId && enteredName) {
      socket.emit('joinRoom', { roomId: enteredRoomId, name: enteredName });
    }
  };

  const startRoom = () => {
    if (socket && roomId) {
      socket.emit('startRoom', roomId);
    }
  };


  return (
    <main className={`${s.main} ${inter.className}`}>
      <div>
        <div>
          <button onClick={() => socket?.emit('createRoom')}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
          <button onClick={startRoom}>Start Room</button>
        </div>
        {roomId && <p>Room ID: {roomId}</p>}
        {name && <p>Your Name: {name}</p>}
        <div>
          <h2>Connected Users:</h2>
          <ul>
            {connectedUsers.map((user) => (
                <li key={user}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
