import Player from "./Player";
import {Socket} from "socket.io";

export default class Room {

    // map of socket to player
    roomCode: string;
    players: Map<string, Player>;

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.players = new Map();
    }

    addPlayer(socket: Socket) {
        this.players.set(socket.id, new Player(socket));
    }
}