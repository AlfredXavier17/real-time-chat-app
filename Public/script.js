const socket = io();

let username = "";
let userColor = "";

const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const form = document.getElementById("chat-form");
const input = document.getElementById("msg-input");

let typingTimeout;

socket.on("init", (data) => {
  username = data.username;
  userColor = data.color;
  data.history.forEach((msg) => displayMsg(msg));
});

socket.on("chat-message", displayMsg);

socket.on("typing", (data) => {
  if (data.isTyping) {
    typing.innerText = `${data.user} is typing...`;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => typing.innerText = "", 1000);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    socket.emit("chat-message", input.value);
    socket.emit("typing", false);
    input.value = "";
  }
});

input.addEventListener("input", () => {
  socket.emit("typing", true);
});

function displayMsg(msg) {
  const li = document.createElement("li");
  li.innerHTML = `<strong style="color:${msg.color}">${msg.user}</strong>: ${msg.text}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}