import Player from "./Player";
import {Socket} from "socket.io";

export default class Room {

    // map of socket to player
    roomCode: string;
    players: Map<string, Player>;
    timer?: NodeJS.Timeout;

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.players = new Map();
    }

    addPlayer(socket: Socket): Player {
        let player = new Player(socket);
        this.players.set(socket.id, player);
        return player;
    }
}