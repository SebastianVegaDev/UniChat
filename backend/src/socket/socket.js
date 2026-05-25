import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { findAllChatChannels } from "../modules/chat/chat.repository.js";
import { createCorsOptions } from "../config/cors.js";

let io = null;

function getChatChannelRoom(channelId) {
    return `chat:channel:${channelId}`;
}

export function initSocket(server) {
    io = new Server(server, {
        cors: createCorsOptions()
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Token required"));
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = {
                id: payload.id,
                role: payload.role
            };

            next();
        } catch {
            next(new Error("Invalid or expired token"));
        }
    });

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
            } catch (error) {
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
