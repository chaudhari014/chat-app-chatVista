import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaPaperPlane, FaImage } from "react-icons/fa";
import { getSender, getSenderFull } from "../chatLogic/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroup from "./UpdateGroup";
import "../style.css";
import API from "../../API";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import notificationSound from "../../sounds/winning.wav";
let socket, selectedChatCompare;

const SingleChate = ({ fetchAgain, setFetchAgain }) => {
  const sound = new Audio(notificationSound);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const [showName, setShowName] = useState("");
  useEffect(() => {
    socket = io(API);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const data = await fetch(
        `${API}/api/message/${selectedChat._id}`,
        config
      );
      const res = await data.json();
      console.log(res);
      setLoading(false);
      setMessages(res);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          sound.play();
          setFetchAgain(!fetchAgain);
        }
      } else {
        // console.log("inside");
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (
      (event.key === "Enter" && newMessage) ||
      (event.type === "click" && newMessage)
    ) {
      socket.emit("stop typing", selectedChat._id);
      try {
        let obj = {
          content: newMessage,
          chatId: selectedChat._id,
        };
        setNewMessage("");
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(obj),
        };
        const data = await fetch(`${API}/api/message`, config);
        const res = await data.json();
        socket.emit("new message", res);
        setMessages([...messages, res]);
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
              </>
            ) : (
              <>
                {selectedChat?.chatName.toUpperCase(user, selectedChat?.users)}
                <UpdateGroup
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="calc(100vh - 100px)"
            borderRadius="lg"
            overflowY="scroll"
          >
            {loading ? (
              <Spinner
                size={"md"}
                w={20}
                h={20}
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? <Text textAlign={"center"}> is typing...</Text> : <></>}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              // padding="10px"
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter message..."
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={sendMessage}
              />
              <IconButton
                icon={<FaPaperPlane />}
                colorScheme="teal"
                aria-label="Send message"
                onClick={sendMessage}
              />
              <IconButton
                icon={<FaImage />}
                colorScheme="blue"
                aria-label="Send image"
                // onClick={sendImage}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChate;
