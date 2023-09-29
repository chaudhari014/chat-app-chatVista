import React from "react";
import { ViewIcon, CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
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
  Box,
  Text,
} from "@chakra-ui/react";

const LogOut = ({ children, LogOutHandler }) => {
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
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent borderRadius="8px">
          <ModalHeader
            bg="blue.500"
            color="white"
            textAlign="center"
            padding="20px"
            fontSize="1.2rem"
            fontWeight="bold"
          >
            Are You Sure You Want to Logout
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" padding="20px">
            <Box mb="1rem">
              <CheckCircleIcon w={8} h={8} color="green.500" />
            </Box>
            <Text fontFamily="work sans">Confirm Logout?</Text>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              colorScheme="blue"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={LogOutHandler}
              leftIcon={<CloseIcon />}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LogOut;
