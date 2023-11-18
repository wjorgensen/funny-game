import {Socket} from "socket.io";
import FunnyImage from "./FunnyImage";

export default class Player {
    socket: Socket;
    nickname: string;
    funnyImage: FunnyImage;

    constructor(socket: Socket) {
        this.socket = socket;
        this.nickname = "Player " + Math.floor(Math.random() * 1000);
        this.funnyImage = new FunnyImage(this);
    }

    setNickname(nickname: string) {
        this.nickname = nickname;
    }
}