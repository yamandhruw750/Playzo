import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./models/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routers/user.routes.js";
import subscriptionRouter from "./routers/subscription.routes.js";
import videoRouter from "./routers/video.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);

export { app };
