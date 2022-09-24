import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

export default function ChatPage({ socket }) {
  const page = window.location.pathname;
  const navigate = useNavigate();
  useEffect(()=>
{if (page === "/chat" && !localStorage.getItem("userName")) navigate("/")})

  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
    socket.on("stopTyping", (data) => setTypingStatus(data));
  }, [socket]);

  return (
    <div className="chat">
      <div className="chat__main">
        <ChatBar socket={socket} />
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
        />
      </div>
      <ChatFooter socket={socket} />
    </div>
  );
}
