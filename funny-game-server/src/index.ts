import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import http from 'http';

const app = express();
const port = process.env.PORT || 3001;
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

    // For when the player inputs a prompt to generate the next image
    socket.on('send-prompt', (prompt) => {
        console.log("Prompt received: " + prompt);
    })

    socket.on('start-game', () => {
        console.log("Game started by host");
        socket.emit('request-prompt')
        socket.emit('image-url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png')
    })
})

// todo: create the room in a realtime db

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
