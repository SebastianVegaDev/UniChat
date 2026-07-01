import { Server } from "socket.io";
import { createCorsOptions } from "../config/cors.js";
import { findAllChatChannels } from "../modules/chat/chat.repository.js";
import { verifyJwtToken } from "../shared/auth/jwtSession.js";

let io = null;

function getChatChannelRoom(channelId) {
    return `chat:channel:${channelId}`;
}

function authenticateSocket(socket, next) {
    const token = socket.handshake.auth?.token;

    try {
        socket.user = verifyJwtToken(token);

        next();
    } catch (error) {
        next(new Error(error.message));
    }
}

export function initSocket(server) {
    io = new Server(server, {
        cors: createCorsOptions()
    });

    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        socket.on("chat:join-channels", async (channelIds = []) => {
            try {
                const allowedChannels = await findAllChatChannels(socket.user.id);

                const allowedChannelIds = new Set(
                    allowedChannels.map((channel) => `${channel.id}`)
                );

                const validChannelIds = [...new Set(channelIds)].filter((channelId) => {
                    return allowedChannelIds.has(`${channelId}`);
                });

                validChannelIds.forEach((channelId) => {
                    socket.join(getChatChannelRoom(channelId));
                });
            } catch {
                socket.emit("socket:error", {
                    message: "Could not join chat channels"
                });
            }
        });
    });

    return io;
}

export function emitToChatChannel(channelId, eventName, payload) {
    if (!io) return;

    io.to(getChatChannelRoom(channelId)).emit(eventName, payload);
}