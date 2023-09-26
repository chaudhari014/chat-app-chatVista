const express = require("express");
const { connection } = require("./config/db");
const { chats } = require("./data/chat");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "hello" });
});
app.get("/chats", (req, res) => {
  res.send({ msg: chats });
});
app.listen(8070, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  console.log("connected server");
});
