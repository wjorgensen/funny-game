import TextInput from '@/components/TextInput';
import {useEffect, useState} from "react";
import io from 'socket.io-client';

export default function Home() {
    const [action, setAction] = useState('None');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000'); // Adjust this URL to your server
        // @ts-ignore
        setSocket(newSocket);

        newSocket.on('request-prompt', () => {
            setAction('Request Prompt');
            // Additional actions can be taken here, such as showing a prompt input
        });

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const startGame = () => {
        if (socket) {
            // @ts-ignore
            socket.emit('start-game');
        }
    }

    return (
        <>
            <label>Current action: </label>
            <label>{action}</label>

            <TextInput/>

            <button onClick={startGame}>Start Game</button>
        </>
    );
}
