import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { getAuthToken } from "../../shared/auth/sessionStorage.js";
import { SOCKET_URL } from "../../shared/api/config.js";

let socket: Socket | null = null;

export function getSocket(): Socket {
    const token = getAuthToken();

    if (!socket) {
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

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
