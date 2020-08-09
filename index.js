// node server which will handle socket.io connection
const io = require("socket.io")(process.env.PORT || 8000);

const users = {};

io.on("connection", (socket) => {
  // If any new joins, let other users connected to the server know!
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  // If someone sends a message, broadcast it to the other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  // If someone leaves the chat .let other know!
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
