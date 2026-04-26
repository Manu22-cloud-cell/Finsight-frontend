import { io } from "socket.io-client";

const socket = io("http://18.61.211.121", {
  transports: ["websocket"], // avoids polling issues
  reconnection: true,
});

export default socket;