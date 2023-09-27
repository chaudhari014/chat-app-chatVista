const jwt = require("jsonwebtoken");
const { User } = require("../model/user.model");

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (decode) {
        req.user = await User.findById(decode.id).select("-password");
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized Token not Found");
  }
};
module.exports = { auth };
