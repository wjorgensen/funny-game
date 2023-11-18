import Link from "next/link";
import styles from "./lobby.module.scss";

export default function Home() {
  const numOfParticipants = 5;

  return (
    <>
      <div className={styles.grid}>
        <h1>Participants</h1>
        <div className={styles.textField}>
          <h2>{numOfParticipants}</h2>
        </div>
        <h1>Room Code</h1>
        <div className={styles.textField}>
          <h2>12345</h2>
        </div>
        <button className="button">Play Game</button>
      </div>
    </>
  );
}
