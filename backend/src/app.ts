import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createCorsOptions } from "./config/cors.js";
import { env } from "./config/env.js";

const app = express();
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(env.http.rateLimitMaxRequests),
    standardHeaders: "draft-8",
    legacyHeaders: false
});

app.disable("x-powered-by");
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
}));
app.use(cors(createCorsOptions()));
app.use(express.json({
    limit: env.http.jsonBodyLimit
}));
app.use("/api", apiLimiter);
app.use("/api", routes);
app.use("/uploads", express.static("uploads", {
    fallthrough: false,
    immutable: true,
    maxAge: "7d"
}));
app.use(errorMiddleware);

export default app;
