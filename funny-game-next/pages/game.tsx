import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import io, {Socket} from "socket.io-client";

const Game = () => {
    const router = useRouter();
    const {roomId} = router.query; // Get roomId from URL if needed
    const [socket, setSocket] = useState<Socket | null | any>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [inputText, setInputText] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io(
            "http://localhost:5000"
        );
        setSocket(newSocket);

        newSocket.on('showImage', (url: string) => {
            setUrl(url);
        })

        // Clean up the socket connection on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [])

    const submitText = () => {
        if (socket && inputText) {
            socket.emit('submitText', inputText); // Replace 'submitText' with your actual event
            setInputText(''); // Clear the input after sending
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    return (
        <div>
            <input type="text" placeholder="Enter text here" value={inputText ?? ''} onChange={handleInputChange}/>
            <button onClick={submitText}>Submit</button>
            {url && <img src={url} alt="Submitted"/>}
        </div>
    );
};

export default Game;
