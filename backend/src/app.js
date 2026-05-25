import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createCorsOptions } from "./config/cors.js";

const app = express();

app.use(cors(createCorsOptions()));
app.use(express.json());
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

export default app;
