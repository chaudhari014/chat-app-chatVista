const { User } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userSignUp = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("please Enter all the Fields");
    //throw new Error("please Enter all the Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User Already Exists");
    //throw new Error("User Already Exists");
  }
  try {
    bcrypt.hash(password, 2, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(403).json({ msg: err });
      }
      let obj = {
        name: name,
        email: email,
      };
      if (pic) {
        obj.pic = pic;
      }
      const user = new User({ ...obj, password: hash });
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      });
    });
  } catch (error) {
    return res.status(400).send("failed to create the new user");
    //throw new Error("failed to create the new user");
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
              name: getUser.name,
              _id: getUser._id,
              email: getUser.email,
              pic: getUser.pic,
              token: jwt.sign({ id: getUser._id }, process.env.SECRET_KEY, {
                expiresIn: "7d",
              }),
            },
          });
        } else {
          return res.status(400).send("Wrong Credential");
         // throw new Error("Wrong Credential");
        }
      });
    } else {
      return res.status(400).send(`${error}`);
     // throw new Error("Wrong Credential");
    }
  } catch (error) {
    return res.status(400).send("Wrong Credential");
    //throw new Error(`${error}`);
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
  //console.log(req.user);
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
};

module.exports = { userLogin, userSignUp, getUser };
