import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { Server as SocketServer, Socket } from "socket.io";
import { createCorsOptions } from "../config/cors.js";
import { findAllChatChannels } from "../modules/chat/chat.repository.js";
import { verifyJwtToken } from "../shared/auth/jwtSession.js";
import type { SessionUser } from "../shared/types/domain.types.js";

type AuthenticatedSocket = Socket & {
    user: SessionUser;
};

let io: SocketServer | null = null;

function getChatChannelRoom(channelId: string | number): string {
    return `chat:channel:${channelId}`;
}

function authenticateSocket(socket: Socket, next: (error?: Error) => void): void {
    const token = socket.handshake.auth?.token;

    try {
        (socket as AuthenticatedSocket).user = verifyJwtToken(
            typeof token === "string" ? token : undefined
        );

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Socket authentication failed";
        next(new Error(message));
    }
}

export function initSocket(server: HttpServer): SocketServer {
    io = new Server(server, {
        cors: createCorsOptions()
    });

    io.use(authenticateSocket);

    io.on("connection", (socket: Socket) => {
        const authenticatedSocket = socket as AuthenticatedSocket;

        authenticatedSocket.on("chat:join-channels", async (channelIds: Array<string | number> = []) => {
            try {
                const allowedChannels = await findAllChatChannels(authenticatedSocket.user.id);

                const allowedChannelIds = new Set(
                    allowedChannels.map((channel) => `${channel.id}`)
                );

                const validChannelIds = [...new Set(channelIds)].filter((channelId) => {
                    return allowedChannelIds.has(`${channelId}`);
                });

                validChannelIds.forEach((channelId) => {
                    authenticatedSocket.join(getChatChannelRoom(channelId));
                });
            } catch {
                authenticatedSocket.emit("socket:error", {
                    message: "Could not join chat channels"
                });
            }
        });
    });

    return io;
}

export function emitToChatChannel(
    channelId: string | number,
    eventName: string,
    payload: unknown
): void {
    if (!io) return;

    io.to(getChatChannelRoom(channelId)).emit(eventName, payload);
}
