const mongoose = require("mongoose");
const userSchema =
  ({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestaps: true });
const User = mongoose.model("User", userSchema);

module.exports = { User };
