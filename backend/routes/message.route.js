const express = require("express");
const messageRoutes = express.Router();

const { auth } = require("../middleware/auth.middleware");
const {
  sendMessage,
  allMessages,
} = require("../controller/message.controller");

messageRoutes.use(auth);

messageRoutes.post("/", sendMessage);
messageRoutes.get("/:chatId", allMessages);

module.exports = { messageRoutes };
