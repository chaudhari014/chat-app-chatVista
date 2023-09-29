const { Chat } = require("../model/chat.model");
const { User } = require("../model/user.model");

accessChat = async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    console.log("userid not sent with request");
    return res.status(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userID],
    };
    try {
      const createChate = new Chat(chatData);
      //console.log(createChate);
      let data = await createChate.save();
      //console.log(data);
      const fullChat = await Chat.findOne({ _id: data._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

fetchChats = async (req, res) => {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    let isChat = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(isChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
createGroupChat = async (req, res) => {
  const { users } = req.body;
  if (users.length < 2) {
    return res.status(400).json({ error: "more than 2 user required" });
  }
  users.push(req.user);
  //   users = [...new Set(users)];
  try {
    let groupChat = {
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    };
    const createGroup = new Chat(groupChat);
    const group = await createGroup.save();
    const fullGroupChat = await Chat.findOne({ _id: group._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removeToGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(removeToGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const addToGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(addToGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
