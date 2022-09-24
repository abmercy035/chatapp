const express = require("express");
const app = express();
const PORT = 4000;
const fs = require("fs");
const path = require('path')
//New imports
const http = require("http").Server(app);
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:3000" || "http://localhost:3000",
  },
});

app.use(cors());
// app.use(bodyParser());

let users = [];


app.post("/chatsDB", function (req, res) {
  console.log(req.body)
  fs.writeFile(path.join(__dirname, "DB.json"), Array.from([req.body]), (err) => {
    console.log("successs");
  });
});



socketIO.on("connection", (socket) => {
  
  fs.exists(path.join(__dirname, "DB.json"), (exists) => {
    if (!exists) {
      console.log(path.join(__dirname, "DB.json"));
      fs.writeFile(path.join(__dirname, "DB.json"), '{"name" : "Abraham"}', (err) => {
        console.log("successs");
      });
    } else {
      fs.readFile(path.join(__dirname, "DB.json"), "utf8", (err, data) => {
        socket.emit("chatsDB", data);
        console.log(data);
        });
      }
    });

  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
