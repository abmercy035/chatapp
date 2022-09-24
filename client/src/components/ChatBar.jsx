import React, { useState, useEffect } from 'react';

export default function  ChatBar({ socket }){
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
    console.log(users)
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
      <div id='profile'> avatar</div>
      <h2 className='chat__header'>Active Users</h2>
        <div className="chat__users">
          {users.map((user) => (
           <p key={user.socketID}> {user.userName} </p> 
          ))}
        </div>
    </div>
  );
};
