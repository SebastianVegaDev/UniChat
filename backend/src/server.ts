import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/socket.js";

const PORT = env.port;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});