// websocket.js

const WebSocketServer = require("websocket").server;
const http = require("http");

const server = http.createServer((request, response) => {
  // Not important for WebSocket setup
});
server.listen(4000, () => {
  console.log("WebSocket server is listening on port 4000");
});

const wsServer = new WebSocketServer({
  httpServer: server,
});

module.exports = wsServer;
