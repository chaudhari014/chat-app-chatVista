import React from "react";
import {
  Container,
  Box,
  Text,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ColorV from "../ReuseData";
import Login from "../components/Login";
import Signup from "../components/Signup";

function HomePage() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        textAlign={"center"}
        p={3}
        bg={ColorV}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"2px"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"work sans"}
          color={"white"}
          fontWeight="800"
        >
          ChatVista
        </Text>
      </Box>
      <Box bg={ColorV} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>SignUP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
