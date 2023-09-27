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
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();
  // console.log(history);
  const toast = useToast();
  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    const { email, password } = formdata;
    if (!email || !password) {
      toast({
        position: "top",
        title: `Please select ${
          (!email && "email") || (!password && "password")
        }`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setloading(false);
      return;
    }
    try {
      const data = await fetch(`${API}/api/user/login`, {
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
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/chats");
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
    setFormdata({ ...formdata, [name]: value });
  };
  return (
    <VStack spacing={"5px"}>
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

      <Button
        colorScheme="blue"
        width={"100%"}
        mt={15}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
