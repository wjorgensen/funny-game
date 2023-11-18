import { Inter } from 'next/font/google'
import styles from "./index.module.scss"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
const inter = Inter({ subsets: ['latin'] })
import Link from 'next/link';


export default function Home() {
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const router = useRouter();

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
      router.push(`/game?roomId=${enteredRoomId}`).then(r => console.log(r));
    }
  };

  const startRoom = () => {
    if (socket && roomId) {
      socket.emit('startRoom', roomId);
    }
  };


  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap');
        body {
          background-color: #011134;
          font-family: 'Jockey One', sans-serif;
        }
      `}</style>

      <nav className={styles.navbar}>
        <ul>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/how-to-play" className={styles.navLink}>How to Play</Link></li>
          <li><Link href="/gallery" className={styles.navLink}>Gallery</Link></li>
          <li><Link href="/faqs" className={styles.navLink}>FAQs</Link></li>
          <li><Link href="/about-us" className={styles.navLink}>About Us</Link></li>
          <li><Link href="/privacy-terms" className={styles.navLink}>Privacy Terms</Link></li>
          <li><Link href="/blog" className={styles.navLink}>Blog</Link></li>
        </ul>
      </nav>

      <header className={styles.header}>
        <img src="/funny-game.png" alt="Funny Game Logo" className={styles.logo} />
        <button className={styles.playButton}>Play Me!</button>
        <p className={styles.tagline}>Unleash Your Imagination with AI-generated Art!</p>
      </header>

      <section className={styles.photoContainerGrid}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="photo-container">{/* content */}</div>
        ))}
      </section>
    </>
  )
}