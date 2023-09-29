const express = require("express");
const { connection } = require("./config/db");
const { chats } = require("./data/chat");
const cors = require("cors");
const { userRoute } = require("./routes/user.route");
const { chatRouteHandler } = require("./routes/chat.route");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "hello" });
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRouteHandler);
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// app.get("/chats", (req, res) => {
//   res.send({ msg: chats });
// });
app.listen(8070, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  console.log("connected server");
});
