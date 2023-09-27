const express = require("express");
const userRoute = express.Router();
const {
  userLogin,
  userSignUp,
  getUser,
} = require("../controller/user.controller");
const { auth } = require("../middleware/auth.middleware");

userRoute.post("/signup", userSignUp);
userRoute.post("/login", userLogin);
userRoute.get("/", auth, getUser);

module.exports = { userRoute };
