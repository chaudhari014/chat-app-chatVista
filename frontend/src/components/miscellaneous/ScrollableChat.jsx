import React from "react";
import ScrollableFeed from "react-scrollable-feed";

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../chatLogic/ChatLogic";
import { Avatar, Tooltip, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import "moment-timezone";
import moment from "moment";
const ScrollableChat = ({ messages }) => {
  const getDate = (date) => {
    const monthsArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let mdate = new Date(date);
    let month = mdate.getMonth();
    let year = mdate.getFullYear();
    let day = mdate.getDate();
    return `${monthsArray[month]} ${day}, ${year}`;
  };
  const getFormattedTime = (date) => {
    let mdate = new Date(date);
    let hours = mdate.getHours();
    let minutes = mdate.getMinutes();
    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${period}`;
  };

  let showDate = [];
  const UpdateDate = (date) => {
    if (showDate.includes(getDate(date))) {
      return true;
    } else {
      showDate.push(getDate(date));
      return false;
    }
  };

  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, m, i, user._id)) && (
              <>
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hashArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={"1"}
                    size={"sm"}
                    cursor={"pointer"}
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              </>
            )}

            {!UpdateDate(m.createdAt) ? (
              <Text
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  fontWeight: "bold",
                  marginLeft: "48%",
                }}
              >
                {getDate(m.createdAt)}
              </Text>
            ) : (
              ""
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#Bee3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.sender._id !== user._id ? (
                <Text color={"blue"} size={"4xs"}>
                  ~{m.sender.name}
                </Text>
              ) : (
                ""
              )}
              {m.content}
              <Text
                textAlign={"end"}
                fontSize="xs"
                fontWeight={500}
                color={"#455A64"}
              >
                {getFormattedTime(m.createdAt)}
              </Text>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
