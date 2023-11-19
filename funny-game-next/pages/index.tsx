import styles from './index.module.scss';
import { Inter, Jockey_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });
const jockeyOne = Jockey_One({ weight: "400", subsets: ["latin"] });
import Link from "next/link";
import { setIn } from "immutable";

const images = [
  'dragtit.png', 'mariof1.png', 'prplan.png',
  'shrek-waffle.png', 'sonicss.png', 'spbob.png',
  'squidd.png', 'deathfry.png', 'leakboat.png'
];

export default function Home() {
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string | null>(null);

  const [isStarted, setStarted] = useState(false);
  const [isInLobby, setInLobby] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("roomCreated", (data: { roomId: string }) => {
      console.log("Room created:", data);
      setRoomId(data.roomId);
    });

    newSocket.on("joinedRoom", (data: { roomId: string; name: string }) => {
      console.log("Joined room:", data);
      setInLobby(true);
      setName(data.name);
      setConnectedUsers((prevUsers) => [...prevUsers, data.name]);
    });

    newSocket.on("roomNotFound", () => {
      console.log("Room not found");
    });

    newSocket.on("roomStarted", () => {
      setStarted(true);
      console.log("Room started");
    });

    newSocket.on("roundEnded", (i) => {
      console.log("The " + i + " round has ended");
    });

    newSocket.on("updatePlayers", (data: string[]) => {
      console.log("Updated players:", data);
      setConnectedUsers(data);
    });

    newSocket.on("showImage", (url: string) => {
      console.log("showImage", url);
      setUrl(url);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Clean up the socket connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Run once on component mount

  const joinRoom = () => {
    const enteredRoomId = prompt("Enter room ID:");
    const enteredName = prompt("Enter your name:");
    if (socket && enteredRoomId && enteredName) {
      socket.emit("joinRoom", { roomId: enteredRoomId, name: enteredName });
    }
  };

  const startRoom = () => {
    if (socket && roomId) {
      socket.emit("startRoom", roomId);
    }
  };

  if (!isStarted && !isInLobby) {
      return (
    <>
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

      <section className={`${styles.photoContainerGrid} 
        ${jockeyOne.style}
      `}>
        {images.map((image, index) => (
          <div key={index} className={styles.photoContainer}>
            {/* Update the src to point to the images folder */}
            <img src={`/fg-ai-photos/${image}`} alt={image.split('.')[0]} className={styles.photo} />
          </div>
        ))}
      </section>
    </>
  )
  }

  if (isInLobby) {
    return (
      <>
        <div className={styles.grid}>
          <h1 className={styles.header}>Lobby</h1>
          <h1 className={styles.partiHeader}>Participants</h1>
          <div className={styles.partiList}>
            <ul className={styles.partiList}>
              <li>Partcipant 1</li>
              <li>Partcipant 2</li>
              <li>Partcipant 3</li>
            </ul>
          </div>
          <h1 className={styles.codeHeader}>
            Room
            <br />
            Code
          </h1>
          <div className={styles.code}>
            <h2>ABCD</h2>
          </div>
          <button className={styles.playButton}>Play Game</button>
        </div>
      </>
    );
  }

  const submitText = () => {
    if (socket && inputText) {
      socket.emit("submitText", inputText); // Replace 'submitText' with your actual event
      setInputText(""); // Clear the input after sending
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Enter text here"
          value={inputText ?? ""}
          onChange={handleInputChange}
        />
        <button onClick={submitText}>Submit</button>
        {url && <img src={url} alt="Submitted" />}
      </div>
    </>
  );
}
