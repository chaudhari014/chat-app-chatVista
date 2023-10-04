import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import { useNavigate } from "react-router-dom";
import LogOut from "./LogOut";
import API from "../../API";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import { getSender } from "../chatLogic/ChatLogic";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const LogOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        position: "top-left",
        title: `Please Enter Something Search`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        method: "GET",
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const response = await fetch(`${API}/api/user?search=${search}`, config);
      const result = await response.json();
      setLoading(false);
      console.log(result);
      setSearchResult(result);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        position: "top-left",
        title: `Error`,
        description: "Failed to Load Result",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userID: userId }),
      };
      const response = await fetch(`${API}/api/chat`, config);
      const result = await response.json();
      if (!chats.find((el) => el._id === result._id))
        setChats([result, ...chats]);
      console.log(result);
      setSelectedChat(result);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      setLoadingChat(false);
      toast({
        position: "top-left",
        title: `Error`,
        description: "Failed to Load Result",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <SearchIcon fontStyle={"2xl"} />
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"work sans"}>
          ChatVista
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "Empty!"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => {
                        if (n.chat.isGroupChat) {
                          return n.chat.chatName !== notif.chat.chatName;
                        } else {
                          return (
                            getSender(user, notif.chat.users) !==
                            getSender(user, n.chat.users)
                          );
                        }
                      })
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message From ${notif.chat.chatName}`
                    : `New Message From ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <div style={{ display: "flex", alignItems: "Center" }}>
                <Avatar
                  size={"sm"}
                  cursor={"pointer"}
                  name={user.name}
                  src={user.pic}
                  mr={2}
                />
                <Text
                  display={{ base: "none", md: "inline-block" }}
                  maxWidth={"80px"}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                >
                  {user.name}
                </Text>
              </div>
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <LogOut LogOutHandler={LogOutHandler}>
                <MenuItem>LogOut</MenuItem>
              </LogOut>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="serch by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  flag={true}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
