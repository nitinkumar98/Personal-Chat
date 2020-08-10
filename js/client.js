const socket = io("http://localhost:8000");

// Get DOM elements in respective JS variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
// Audio that will play on receiving messages
var audio = new Audio("whatsapp_new_message.mp3");

// Function which will append event info to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask new user for his/her name and let the server know!
const name = prompt("Enter your name to join");

// If a new user joins,receive the event from the server
socket.emit("new-user-joined", name);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the Chat`, "right");
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// IF a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// If the forms gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.length > 0) {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  }
});
