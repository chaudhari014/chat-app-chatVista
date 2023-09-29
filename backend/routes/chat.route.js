const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chat.controller");
const chatRouteHandler = express.Router();
chatRouteHandler.use(auth);
chatRouteHandler.post("/", accessChat);
chatRouteHandler.get("/", fetchChats);
chatRouteHandler.post("/group", createGroupChat);
chatRouteHandler.put("/renamegroup", renameGroup);
chatRouteHandler.put("/groupremove", removeFromGroup);
chatRouteHandler.put("/groupadd", addToGroup);

module.exports = { chatRouteHandler };
