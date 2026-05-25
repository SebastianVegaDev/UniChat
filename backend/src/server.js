import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { ensureRuntimeSchema } from "./schema/runtimeSchema.js";

dotenv.config()

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

ensureRuntimeSchema().catch((error) => {
    console.warn("Runtime schema check skipped:", error.message);
});
