import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {
  routerRestaurants,
  routerUser,
  routerDishes,
  routerEvaluate,
  routerVerificationCode,
  routerPayment,
  routerDataUser,
} from "./routes/index.js";
import socketServer from "./sockets/socketServer.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", routerUser);
app.use("/api/v1/data-user", routerDataUser);
app.use("/api/v1/restaurants", routerRestaurants);
app.use("/api/v1/dishes", routerDishes);
app.use("/api/v1/evaluate", routerEvaluate);
app.use("/api/v1/verification", routerVerificationCode);
app.use("/api/v1/payment", routerPayment);
app.use("/payment-success", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("Welcome to Baodt2911");
});
await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("***Connect successfully***");
  })
  .catch((error) => {
    const { code } = error;
    if (code === 8000) {
      console.log("***Wrong database***");
    }
  });
socketServer(io);
server.listen(PORT, async () => {
  console.log(`PORT: http://localhost:${PORT}`);
});
