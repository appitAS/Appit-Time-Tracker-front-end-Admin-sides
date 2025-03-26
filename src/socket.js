import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL; // ✅ Use import.meta.env for Vite

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
