import React, { useState } from "react";
import API from "../API";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  useToast,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
const Signup = () => {
  const navigate = useNavigate();
  // console.log(history);
  const toast = useToast();
  const [show, setshow] = useState(false);
  const [upload, setupload] = useState(false);
  const [loading, setloading] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });
  const postDetails = (pic) => {
    setupload(true);
    // setloading(true);
    if (!pic) {
      toast({
        position: "top",
        title: "Please select Image",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const data = new FormData();
    console.log(pic);
    data.append("file", pic);
    data.append("upload_preset", "chat-vista");
    data.append("cloud_name", "dkxqo1meo");
    fetch("https://api.cloudinary.com/v1_1/dkxqo1meo/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setFormdata({ ...formdata, pic: data.url.toString() });
        // setloading(false);

        setupload(false);
      })
      .catch((err) => {
        console.log(err);
        // setloading(false);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    const { name, email, password, pic } = formdata;
    if (!name || !email || !password || !pic) {
      toast({
        position: "top",
        title: `Please select ${
          (!name && "name") ||
          (!email && "email") ||
          (!password && "password") ||
          (!pic && "picture")
        }`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setloading(false);
      return;
    }
    try {
      const data = await fetch(`${API}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const res = await data.json();
      toast({
        position: "top",
        title: `Registration Sccessfull`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setloading(false);
      navigate("/");
    } catch (error) {
      console.log(error, "ERROR");
      setloading(false);
      toast({
        position: "top",
        title: "Error!",
        description: error.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormdata({ ...formdata, [name]: value });
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          border={"none"}
          borderBottom={"1px solid "}
          outline={"none"}
          shadow={"none"}
          borderRadius={"4px"}
          fontWeight={600}
          _focusVisible={"none"}
          placeholder="Enter Your Name"
          //   bg={"white"}
          onChange={(e) => handleInput(e)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          border={"none"}
          borderBottom={"1px solid "}
          outline={"none"}
          shadow={"none"}
          borderRadius={"4px"}
          fontWeight={600}
          _focusVisible={"none"}
          placeholder="Enter Your email"
          //   bg={"white"}
          onChange={(e) => handleInput(e)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="password"
            border={"none"}
            borderBottom={"1px solid "}
            outline={"none"}
            shadow={"none"}
            borderRadius={"4px"}
            fontWeight={600}
            _focusVisible={"none"}
            placeholder="Enter Your password"
            // bg={"white"}
            onChange={(e) => handleInput(e)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              bg={"transparent"}
              onClick={() => setshow(!show)}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          name="name"
          p={1.5}
          accept="image/*"
          // isLoading={loading}
          border={"none"}
          onChange={(e) => postDetails(e.target.files[0])}
        />
        {upload && <Spinner ml={2} />}
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        mt={15}
        onClick={(e) => submitHandler(e)}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
