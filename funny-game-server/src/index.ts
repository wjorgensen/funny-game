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

// todo: create the room in a realtime db

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
