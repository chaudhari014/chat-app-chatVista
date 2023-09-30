import { Box, Avatar, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/chatProvider";

const UserListItem = ({ handleFunction, user }) => {
  //const { user } = ChatState();
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg={"#e8E8E8"}
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w={"100%"}
      display={"flex"}
      alignItems={"center"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
    >
      <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize={"xs"}>{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
