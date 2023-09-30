import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box, useToast, Button, Text, Stack, Avatar } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import API from "../../API";
import { getSender } from "../chatLogic/ChatLogic";
import ProfileModal from "./ProfileModal";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();
  const toast = useToast();
  // console.log(selectedChat);
  const fetchChats = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const response = await fetch(`${API}/api/chat`, config);
      const result = await response.json();
      setChats(result);
    } catch (error) {
      console.log(error);
      toast({
        position: "top",
        title: `Error`,
        description: "Failed to Load Result",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text> My Chat</Text>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat._id === chat._id ? "white" : "black"}
                px={3}
                display={"flex"}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <ProfileModal
                  user={
                    loggedUser && chat.users[0]._id === loggedUser._id
                      ? chat.users[1]
                      : chat.users[0]
                  }
                >
                  <Avatar
                    mr={2}
                    size={"sm"}
                    cursor={"pointer"}
                    name={
                      loggedUser && chat.users[0]._id === loggedUser._id
                        ? chat.users[1].name
                        : chat.users[0].name
                    }
                    src={
                      loggedUser && chat.users[0]._id === loggedUser._id
                        ? chat.users[1].pic
                        : chat.users[0].pic
                    }
                  />
                </ProfileModal>
                <Box>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}{" "}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
