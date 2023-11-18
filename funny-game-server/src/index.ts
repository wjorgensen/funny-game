import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import http from 'http';

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)

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

io.on('connection', (socket) => {
    socket.on('client-ready', () => {
        socket.broadcast.emit('get-canvas-state')
    })

    socket.on('canvas-state', (state) => {
        console.log('received canvas state')
        socket.broadcast.emit('canvas-state-from-server', state)
    })

    socket.on('clear', () => io.emit('clear'))
})

// todo: create the room in a realtime db

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
