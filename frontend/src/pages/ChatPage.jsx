import React, { useEffect } from "react";
import axios from "axios";
import API from "../API";
function ChatPage() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${API}/chats`);
      const result = await data.json();
      console.log(result);
    };
    fetchData();
  }, []);

  return <div>ChatPage</div>;
}

export default ChatPage;
