import { useEffect } from "react";
import { getSocket } from "./socket.js";
import {
    addChatMessage,
    markChatChannelMessagesRead,
    markChatMessageDeleted,
    setPinnedChatMessage,
    updateChatChannelLock,
    updateChatMessageReactions
} from "../bootstrap/updaters/chat.updaters.js";

export function useRealtime({ data, updateBootstrap }) {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || !data?.chatChannels?.length) return;

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
        }

        const channelIds = data.chatChannels.map((channel) => channel.id);

        socket.emit("chat:join-channels", channelIds);

        function handleMessageCreated(message) {
            updateBootstrap((currentData) => {
                return addChatMessage(currentData, message);
            });
        }

        function handleMessageDeleted(payload) {
            updateBootstrap((currentData) => {
                return markChatMessageDeleted(
                    currentData,
                    payload.messageId,
                    payload.deletedMessage
                );
            });
        }

        function handleMessageReactionsUpdated(payload) {
            updateBootstrap((currentData) => {
                return updateChatMessageReactions(
                    currentData,
                    payload.messageId,
                    payload.reactions,
                    payload.userId
                );
            });
        }

        function handleMessagesRead(payload) {
            updateBootstrap((currentData) => {
                return markChatChannelMessagesRead(
                    currentData,
                    payload.channelId,
                    payload.userId,
                    payload.readMessageIds
                );
            });
        }

        function handlePinnedMessageUpdated(payload) {
            updateBootstrap((currentData) => {
                return setPinnedChatMessage(currentData, payload);
            });
        }

        function handleChannelLockUpdated(payload) {
            updateBootstrap((currentData) => {
                return updateChatChannelLock(
                    currentData,
                    payload.channelId,
                    payload.isLocked
                );
            });
        }

        function handleConnectError() {
            socket.disconnect();
        }

        socket.on("chat:message-created", handleMessageCreated);
        socket.on("chat:message-deleted", handleMessageDeleted);
        socket.on("chat:message-reactions-updated", handleMessageReactionsUpdated);
        socket.on("chat:messages-read", handleMessagesRead);
        socket.on("chat:pinned-message-updated", handlePinnedMessageUpdated);
        socket.on("chat:channel-lock-updated", handleChannelLockUpdated);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("chat:message-created", handleMessageCreated);
            socket.off("chat:message-deleted", handleMessageDeleted);
            socket.off("chat:message-reactions-updated", handleMessageReactionsUpdated);
            socket.off("chat:messages-read", handleMessagesRead);
            socket.off("chat:pinned-message-updated", handlePinnedMessageUpdated);
            socket.off("chat:channel-lock-updated", handleChannelLockUpdated);
            socket.off("connect_error", handleConnectError);
        };
    }, [data?.chatChannels, updateBootstrap]);
}
