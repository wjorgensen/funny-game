import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';

const app = express();
const port = process.env.PORT || 3000;
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


interface Room {
    roomId: string;
    clients: Socket[];
}
const rooms: Room[] = [];

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('createRoom', () => {
        const roomId = Math.floor(1000 + Math.random() * 9000).toString();
        socket.join(roomId);

        rooms.push({ roomId, clients: [socket] });

        io.to(socket.id).emit('roomCreated', { roomId });
        console.log(`Room created with ID: ${roomId}`);
    });

    socket.on('joinRoom', (roomId: string) => {
        const room = rooms.find((r) => r.roomId === roomId);

        if (room) {
            socket.join(roomId);
            room.clients.push(socket);

            io.to(socket.id).emit('joinedRoom', { roomId });
            console.log(`User joined room with ID: ${roomId}`);
        } else {
            io.to(socket.id).emit('roomNotFound');
        }
    });

    socket.on('startRoom', (roomId: string) => {
        const room = rooms.find((r) => r.roomId === roomId);

        if (room) {
            io.to(roomId).emit('roomStarted');
            console.log(`Room with ID ${roomId} started`);
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
