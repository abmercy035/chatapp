import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Home({ socket }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const data = {
    name: "geeksforgeeks",
    job: "Content Writer",
    topic: "Node.js",
  };

fetch("http://locahost:4000/chats", {
  method: "post",
  "Access-Control-Allow-Origin": "*",
  headers: {
       "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})

  // axios.post("server/DB.json", data);


  const handleSubmit = (e) => {
    e.preventDefault();
    const pass = localStorage.getItem("Password");
    const UserName = localStorage.getItem("userName");
    if (userName && password) {
      if (pass && UserName) {
        if (pass === password && UserName === userName) {
          navigate("/chat");
        } else {
          input_errMsg.style.color = "red";
          input_errMsg.textContent = "UserName or Password is inCorrect";
          input_errMsg.className = "animate_input_errMsg";

          setTimeout(() => {
            input_errMsg.className = "";
          }, 1000);
        }
      } else if (!pass && !UserName) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("Password", password);
        //sends the username and socket ID to the Node.js server
        socket.emit("newUser", { userName, socketID: socket.id });
        navigate("/chat");
      }
    } else if (!userName && !password) {
      input_errMsg.style.color = "red";
      input_errMsg.textContent = "Please Enter A user Name and A Password";
      input_errMsg.classList = "animate_input_errMsg";
    }
  };

  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label className="inp_label" htmlFor="username">
        Username
      </label>
      <input
        type="text"
        minLength={4}
        maxLength={10}
        name="username"
        id="username"
        className="user__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <label className="inp_label" htmlFor="password">
        Password
      </label>
      <input
        type="password"
        minLength={6}
        name="password"
        id="password"
        className="user__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p id="input_errMsg"> </p>
      <button className="home__cta">SIGN IN</button>
    </form>
  );
}
