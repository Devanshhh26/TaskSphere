import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes"
import projectRoutes from "./routes/projectRoutes"
import boardRoutes from "./routes/boardRoutes";
import taskRoutes from "./routes/taskRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", boardRoutes);
app.use("/api/projects", taskRoutes);

const PORT = process.env.PORT || 5000;

// HTTP + WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
