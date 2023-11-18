import React from "react";
import styles from "./lobby.module.scss";

export default function Lobby() {
  return (
    <>
      <div className={styles.grid}>
        <h1 className={styles.header}>Lobby</h1>
        <h1>Participants</h1>
        <div>
          <ul>
            <li>Partcipant 1</li>
            <li>Partcipant 2</li>
            <li>Partcipant 3</li>
          </ul>
        </div>
        <h1>
          Room
          <br />
          Code
        </h1>
        <div>
          <h2>ABCD</h2>
        </div>
        <button>Play Game</button>
      </div>
    </>
  );
}
