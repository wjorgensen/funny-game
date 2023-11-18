import {Socket} from "socket.io";
import FunnyImage from "./FunnyImage";
import Room from "./Room";

export default class Player {
    room: Room;
    socket: Socket;
    nickname: string;
    funnyImage: FunnyImage;

    currentPrompt?: string;

    constructor(room: Room, socket: Socket) {
        this.room = room;
        this.socket = socket;
        this.nickname = "Player " + Math.floor(Math.random() * 1000);
        this.funnyImage = new FunnyImage(this);

        this.socket.on("sendPrompt", (prompt: string) => {
            this.currentPrompt = prompt;
        })
    }

    setNickname(nickname: string) {
        this.nickname = nickname;
    }

    showImage(image: FunnyImage) {
        // If there are no urls, don't show anything
        if (image.urls.length == 0) {
            console.log("There were no URLS in the " + image.owner.nickname + "'s image when shown to " + this.nickname + "!");
            return;
        }

        // Show only the LATEST url to the player
        let url = image.urls[image.urls.length - 1];
        this.socket.emit("show-image", url);
    }

    requestPrompt() {
        this.socket.emit("requestPrompt")
    }

    updatePlayers() {
        this.socket.emit("updatePlayers", this.room.players.map(player => {
            return player.nickname
        }))
    }
}