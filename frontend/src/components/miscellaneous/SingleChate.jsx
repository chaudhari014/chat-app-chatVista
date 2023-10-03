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
const SingleChate = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { user, selectedChat, setSelectedChat } = ChatState();

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
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (
      (event.key === "Enter" && newMessage) ||
      (event.type === "click" && newMessage)
    ) {
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
        setMessages([...messages, res]);
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
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
