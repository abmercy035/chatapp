import React, { useState } from 'react';

export default function ChatFooter({ socket }){
  const [message, setMessage] = useState('');

  const handleTyping = (state) =>{
    if(state) socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
    else {
      setTimeout(()=> {socket.emit('typing', "")}, 3000)
}
}
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName'))
     {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
      
    socket.emit("stopTyping", {name: ' '})
    }
    setMessage('');
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
       <button id='fav' disabled="disabled"> Favourite
        </button> 
<div id='form_right'>
<input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          /*OnKeyDown function*/
          onKeyPress={()=>handleTyping(true)}
          onKeyUp={()=>handleTyping(false)}
        />
        <input type="submit" className="sendBtn" value="SEND" />
</div>
      </form>
    </div>
  );
}

