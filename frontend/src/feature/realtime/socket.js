import { io } from "socket.io-client";

const SOCKET_URL  = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket = null;

export function getSocket() {
    const token = localStorage.getItem("token");

    if(!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            auth: {
                token
            }
        });
    }

    socket.auth = {
        token
    };

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}