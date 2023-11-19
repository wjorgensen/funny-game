import { Inter, Jockey_One } from "next/font/google";
import styles from "./index.module.scss";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });
const jockeyOne = Jockey_One({ weight: "400", subsets: ["latin"] });
//const jockeyOne = Jockey_One({ weight: "400", subsets: ["latin"] });
import Link from "next/link";
import { setIn } from "immutable";
import FinishedStories from "@/pages/finishedstories";

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
  const [timerText, setTimerText] = useState<string>("30"); // [1, connectedUsers.length

  // finishedStories is a list of data objects, each with a list of image urls, list of text prompts, and the player who started the story
  const [finishedStories, setFinishedStories] = useState<any[] | null>(null);

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
    });

    newSocket.on("showImage", (url: string) => {
      console.log("showImage", url);
      setUrl(url);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("gameFinished", (data: any[]) => {
      console.log("gameFinished", data);
      setFinishedStories(data);
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

  // When all the stories are finished, show the gallery
  // Remember that finishedStories is an array of objects, and each object has:
  // 1. player -> the player who started the story
  // 2. urls -> The list of image urls
  // 3. prompts -> The list of text prompts
  if (finishedStories) {
    return <FinishedStories finishedStories={finishedStories} />;
  }

  //home page
  if (!isStarted && !isInLobby) {
    return (
      <>
        <div className={styles.mainGrid}>
          <img
            src="/text1-8.png"
            alt="Funny Game Logo"
            className={styles.logo}
          />
          <button onClick={joinRoom} className={styles.joinRoom}>
            Join Room
          </button>
          <button onClick={createRoom} className={styles.createRoom}>
            Create Room
          </button>
        </div>
      </>
    );
  }

  //lobby page
  if (!isStarted) {
    return (
      <>
        <div className={styles.grid}>
          <h1
            className={styles.header}
            style={{
              fontFamily: "Press Start 2P",
            }}
          >
            Lobby
          </h1>
          <h1 className={styles.partiHeader}>Participants</h1>
          <div className={styles.partiList}>
            <ul className={styles.partiList1}>
              {connectedUsers.map((user) => (
                <li className={styles.partiItem} key={user}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <h1 className={styles.codeHeader}>Room Code</h1>
          <div className={styles.code}>
            <h2 className={styles.roomKey}>{roomId}</h2>
          </div>
          <button onClick={startRoom} className={styles.playButton}>
            Play Game!
          </button>
        </div>
      </>
    );
  }

  const submitText = () => {
    if (socket && inputText) {
      socket.emit("submitPrompt", inputText);
      console.log("Submitted prompt:", inputText);
      setInputText(""); // Clear the input after sending
    } else {
      console.log("Failed to submit prompt");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  //In game
  return (
    <>
      <div className={`${styles.inGameGrid}`}>
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
          <p>{timerText}</p>
        </div>
        <div className={styles.veryThinLine}></div>
        {url && (
          <img src={url} alt="Submitted" className={styles.returnedImage} />
        )}
      </div>
    </>
  );
}
