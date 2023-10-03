const { Chat } = require("../model/chat.model");
const { User } = require("../model/user.model");
const { Message } = require("../model/message.model");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("invalid data passed into request");
    return res.status(400);
  }
  let messageB = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = new Message(messageB);
    message = await message.save();

    message = await message.populate("sender", "name pic");

    message = await message.populate("chat");
    //console.log(message);
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const allMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await Message.find({ chat: chatId })
      .populate("sender", "name email pic")
      .populate("chat");
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { sendMessage, allMessages };
