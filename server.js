const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("TakeNote WebSocket server is running");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("TakeNote WebSocket server");
});

const wss = new WebSocket.Server({ server });

console.log("TakeNote WebSocket server starting...");

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    let data;

    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      return;
    }

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
