
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, "Public")));

let messageHistory = [];

io.on("connection", (socket) => {

  const username = "User_" + Math.floor(Math.random() * 1000);
  const color = getRandomColor();

  socket.username = username;
  socket.color = color;

  
  socket.emit("init", {
    username,
    color,
    history: messageHistory,
  });

  
  socket.broadcast.emit("user-joined", username);

  socket.on("chat-message", (msg) => {
    const fullMsg = {
      user: socket.username,
      color: socket.color,
      text: msg,
    };

    messageHistory.push(fullMsg);
    if (messageHistory.length > 10) messageHistory.shift();

    io.emit("chat-message", fullMsg);
  });

  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing", {
      user: socket.username,
      isTyping,
    });
  });


  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", socket.username);
  });
});


http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


function getRandomColor() {
  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];
  return colors[Math.floor(Math.random() * colors.length)];
}
