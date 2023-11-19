import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import Room from "./modules/Room";

const app = express();
const port = process.env.PORT || 5001;
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

app.get('/', (req: Request, res: Response) => {
    res.send('0');
});

app.get("/createroom", (req: Request, res: Response) => {
    //create a room id thats always 4 digits long
    let id = Math.floor(1000 + Math.random() * 9000);
    res.send(id.toString());
});

const funnyrooms: Room[] = [];

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('createRoom', () => {
        const roomId = Math.floor(1000 + Math.random() * 9000).toString();
        socket.join(roomId);

        funnyrooms.push(new Room(roomId));

        io.to(socket.id).emit('roomCreated', { roomId });
        console.log(`Room created with ID: ${roomId}`);
    });

    socket.on('joinRoom', (data: { roomId: string; name: string }) => {
        const { roomId, name } = data;
        const room = funnyrooms.find((r) => r.roomCode === roomId);

        if (room) {
            socket.join(roomId);
            let player = room.addPlayer(socket);
            if (player) {
                player.setNickname(name)
                console.log(`${name} joined room with ID: ${roomId}`);
                io.to(socket.id).emit("joinedRoom", { roomId, name });

                // Update all players to make sure they have the latest player list
                room.players.forEach(player => {
                    player.updatePlayers()
                })
            }
        } else {
            io.to(socket.id).emit('roomNotFound');
        }
    });

    socket.on('startRoom', (roomId: string) => {
        const room = funnyrooms.find((r) => r.roomCode === roomId);

        if (room) {
            io.to(roomId).emit('roomStarted');
            console.log(`Room with ID ${roomId} started`);

            room.start();
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// todo: create the room in a realtime db

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
