import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Image
              borderRadius={"full"}
              boxSize={"200px"}
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={"2xl"}>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
