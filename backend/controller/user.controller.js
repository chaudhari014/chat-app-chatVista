const { User } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userSignUp = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password || !pic) {
    res.status(400);
    throw new Error("please Enter all the Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  try {
    bcrypt.hash(password, 2, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(403).json({ msg: err });
      }
      const user = new User({ ...req.body, password: hash });
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      });
    });
  } catch (error) {
    res.status(400);
    throw new Error("failed to create the new user");
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const getUser = await User.findOne({ email });
    if (getUser) {
      bcrypt.compare(password, getUser.password, function (err, result) {
        if (result) {
          res.status(201).json({
            msg: "login successfully",
            data: {
              userid: getUser._id,
              email: getUser.email,
              pic: getUser.pic,
              token: jwt.sign({ userID: getUser._id }, process.env.SECRET_KEY, {
                expiresIn: "7d",
              }),
            },
          });
        } else {
          res.status(400);
          throw new Error("Wrong Credential");
        }
      });
    } else {
      res.status(400);
      throw new Error("Wrong Credential");
    }
  } catch (error) {
    res.status(400);
    throw new Error(`${error}`);
  }
};

const getUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log(keyword);
  const users = await User.find(keyword);
  res.send(users);
};

module.exports = { userLogin, userSignUp, getUser };
