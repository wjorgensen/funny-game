import Player from "./Player";
import {Socket} from "socket.io";

const ROUND_TIME: number = 30;

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

        this.players.forEach(player => {
            player.socket.emit('gameStarted');
        })

        this.gameState = GameState.WaitingForPrompts;
        this.beginRound();
    }

    beginRound() {
        this.players.forEach(player => {
            this.startCountdown(player, ROUND_TIME);
        });

        this.timer = setTimeout(() => {
            this.endRound()
        }, ROUND_TIME * 1000);
    }

    startCountdown(player: Player, time: number) {
        let countdown = time;

        player.socket.emit("timerText", `${countdown} secs`);

        // Set up a countdown interval
        player.countdownInterval = setInterval(() => {
            countdown--;
            player.socket.emit("timerText", `${countdown} secs`);

            if (countdown <= 0) {
                player.socket.emit("timerText", "Time's up!");
                clearInterval(player.countdownInterval);
            }
        }, 1000); // Update the countdown every second
    }

    endRound() {
        this.timer = setTimeout(() => {
            this.gameState = GameState.GeneratingImages;
            console.log(`Round ${this.round} ended for room ${this.roomCode}`);

            this.players.forEach(player => {
                player.socket.emit("currentRound", this.round)
            })

            // Create a promise array to hold all generateNextImage promises
            const imagePromises = this.players.map((player, index) => {
                let prompt = player.currentPrompt;
                if (!prompt)
                    prompt = "The characters sit still, looking mildly confused or annoyed."
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

                if (++this.round <= this.players.length) {
                    this.beginRound(); // Begin the next round
                } else {
                    this.gameState = GameState.Finished;
                    console.log("Game finished!");

                    const stories: any[] = []
                    this.players.forEach(player => {
                        stories.push({
                            player: player.nickname,
                            prompts: player.funnyImage.prompts,
                            urls: player.funnyImage.urls
                        })
                    })

                    this.players.forEach(player => {
                        player.socket.emit("gameFinished", stories);
                    })
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