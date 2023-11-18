import Player from "./Player";
import {Socket} from "socket.io";

export default class Room {

    // map of socket to player
    roomCode: string;
    players: Player[] = [];
    timer?: NodeJS.Timeout;
    gameState: GameState = GameState.Lobby;
    round: number = 0;

    constructor(roomCode: string) {
        this.roomCode = roomCode;
    }

    start() {
        if (this.gameState != GameState.Lobby) {
            console.log("Game was already started... Ignoring")
            return;
        }

        this.gameState = GameState.WaitingForPrompts;
        this.beginRound();
    }

    beginRound() {
        this.timer = setTimeout(() => {
            this.gameState = GameState.GeneratingImages;
            console.log(`Round ${this.round} ended for room ${this.roomCode}`);

            // Create a promise array to hold all generateNextImage promises
            const imagePromises = this.players.map((player, index) => {
                const prompt = player.currentPrompt || "The characters sit still, looking mildly confused or annoyed.";
                const funnyImage = this.players[(index + this.round) % this.players.length].funnyImage;

                // generateNextImage is async, so we call it and return the promise
                return funnyImage.generateNextImage(prompt);
            });

            // Use Promise.all to wait for all generateNextImage promises to resolve
            Promise.all(imagePromises).then(() => {
                // All images have been generated, you can now proceed to the next round
                console.log(`All images generated for round ${this.round}`);

                // Reset prompts for the next round
                this.players.forEach(player => {
                    player.currentPrompt = undefined;
                });

                // Move to the next round
                this.gameState = GameState.WaitingForPrompts;
                this.round++;

                // Show images to players
                this.players.forEach((player: Player, index: number) => {
                    const funnyImage = this.players[(index + this.round) % this.players.length].funnyImage;
                    player.showImage(funnyImage);
                });

                if (++this.round < this.players.length) {
                    this.beginRound(); // Begin the next round
                } else {
                    this.gameState = GameState.Finished;
                    console.log("Game finished!");
                }
            }).catch(error => {
                console.error('Error generating images:', error);
                // Handle errors, such as by ending the game or retrying the round
            });
        }, 20000);
    }

    addPlayer(socket: Socket): Player | null {
        if (this.gameState != GameState.Lobby) {
            console.log("Game has already started... Ignoring")
            return null;
        }

        // Ensure the socket is not already in the room
        if (this.players.find(player => player.socket.id == socket.id)) {
            console.log("Player is already in the room... Ignoring")
            return null;
        }

        let player = new Player(this, socket);
        this.players.push(player);
        return player;
    }
}

// Enum for game state (lobby, waiting for prompts, generating images)
export enum GameState {
    Lobby,
    WaitingForPrompts,
    GeneratingImages,
    Finished
}