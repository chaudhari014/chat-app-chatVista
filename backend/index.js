const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { userRoute } = require("./routes/user.route");
const { chatRouteHandler } = require("./routes/chat.route");
const { messageRoutes } = require("./routes/message.route");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "hello" });
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRouteHandler);
app.use("/api/message", messageRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(8070, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  console.log("connected server");
});

const io = require("socket.io")(server, {
  pingTimeout: 40000,
  cors: {
    origin: "https://chat-app-chat-vista.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("join" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    // console.log(newMessageRecieved);
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat user not defined");
    chat.users.forEach((user) => {
      if (user._id !== newMessageRecieved.sender._id) {
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      }
    });
  });

  socket.off("set-up", () => {
    console.log("userDisconnected");
    socket.leave(userData._id);
  });
});
