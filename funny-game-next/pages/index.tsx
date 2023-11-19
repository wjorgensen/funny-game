import { Inter } from "next/font/google";
import styles from "./index.module.scss";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });
//const jockeyOne = Jockey_One({ weight: "400", subsets: ["latin"] });
import Link from "next/link";
import { setIn } from "immutable";

const images = [
  "dragtit.png",
  "mariof1.png",
  "prplan.png",
  "shrek-waffle.png",
  "sonicss.png",
  "spbob.png",
  "squidd.png",
  "deathfry.png",
  "leakboat.png",
];

export default function Home() {
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1); // [1, connectedUsers.length]
  const [timerText, setTimerText] = useState<string>("30 seconds remaining"); // [1, connectedUsers.length

  // These must be false
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

      // After creating a room, it should be joined automatically
      if (newSocket) {
        const enteredName = prompt("Enter your name:");
        newSocket.emit("joinRoom", { roomId: data.roomId, name: enteredName });
      }
    });

    newSocket.on("joinedRoom", (data: { roomId: string; name: string }) => {
      console.log("Joined room:", data);
      setInLobby(true);
      setName(data.name); // redundancy
      setRoomId(data.roomId); // NOT a redundancy, CRUCIAL for new players
    });

    newSocket.on("roomNotFound", () => {
      console.log("Room not found");
    });

    newSocket.on("roomStarted", () => {
      setStarted(true);
      console.log("Room started");
    });

    newSocket.on("currentRound", (i) => {
      setCurrentRound(i);
      console.log("Started round ", i);
    });

    newSocket.on("updatePlayers", (data: string[]) => {
      console.log("Updated players:", data);
      setConnectedUsers(data);
    });

    newSocket.on("timerText", (data: string) => {
      setTimerText(data);
    })

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

  const createRoom = () => {
    if (socket) {
      setName(name);
      socket.emit("createRoom");
    }
  };

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

  //home page
  if (!isStarted && !isInLobby) {
    return (
      <>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Jockey+One&display=swap");
          body {
            background-color: #011134;
            font-family: "Jockey One", sans-serif;
          }
        `}</style>

        <nav className={styles.navbar}>
          <ul>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/how-to-play" className={styles.navLink}>
                How to Play
              </Link>
            </li>
            <li>
              <Link href="/gallery" className={styles.navLink}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/faqs" className={styles.navLink}>
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/about-us" className={styles.navLink}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-terms" className={styles.navLink}>
                Privacy Terms
              </Link>
            </li>
            <li>
              <Link href="/blog" className={styles.navLink}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        <header className={styles.header}>
          <img
            src="/funny-game.png"
            alt="Funny Game Logo"
            className={styles.logo}
          />
          <button onClick={joinRoom} className={styles.playButton}>
            Join Room
          </button>
          <button onClick={createRoom} className={styles.playButton}>
            Create Room
          </button>
          <p className={styles.tagline}>
            Unleash Your Imagination with AI-generated Art!
          </p>
        </header>

        <section className={styles.photoContainerGrid}>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="photo-container">
              {/* content */}
            </div>
          ))}
        </section>

        <section className={styles.photoContainerGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.photoContainer}>
              {/* Update the src to point to the images folder */}
              <img
                src={`/fg-ai-photos/${image}`}
                alt={image.split(".")[0]}
                className={styles.photo}
              />
            </div>
          ))}
        </section>
      </>
    );
  }

  //lobby page
  if (!isStarted) {
    return (
      <>
        <div className={styles.grid}>
          <h1 className={styles.header}>Lobby</h1>
          <h1 className={styles.partiHeader}>Participants</h1>
          <div className={styles.partiList}>
            <ul className={styles.partiList}>
              {connectedUsers.map((user) => (
                <li className={styles.partiItems} key={user}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <h1 className={styles.codeHeader}>Room Code</h1>
          <div className={styles.code}>
            <text>{roomId}</text>
            <h2 className={styles.roomKey}>ABCD</h2>
          </div>
          <button onClick={startRoom} className={styles.playButton}>
            Play Game
          </button>
        </div>
      </>
    );
  }

  const submitText = () => {
    if (socket && inputText) {
      socket.emit("submitText", inputText);
      setInputText(""); // Clear the input after sending
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  //In game
  return (
    <>
      <div className={styles.inGameGrid}>
        <input
          type="text"
          placeholder="Enter prompt here..."
          value={inputText ?? ""}
          onChange={handleInputChange}
          className={styles.inGameInput}
        />
        <button onClick={submitText} className={styles.inGameSubmit}>
          Submit
        </button>
        <p className={styles.inGamePrompt}>
          Write a prompt to continue the story!
        </p>
        <h1 className={styles.roundNumber}>
          Round {currentRound}/{connectedUsers.length}
        </h1>
        <div className={styles.timer}>
          <p>
            {timerText}
          </p>
        </div>
        <div className={styles.veryThinLine}></div>
        {url && (
          <img src={url} alt="Submitted" className={styles.returnedImage} />
        )}
      </div>
    </>
  );
}
