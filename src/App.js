import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]); 
  const [notification, setNotification] = useState('');  

  useEffect(() => {
    const socketIo = io('https://pubsub-tutorial-685259971562.us-east1.run.app'); 

    socketIo.on('pubsubMessage', (message) => {
      console.log("Message received from server:", message);
      setReceivedMessages((prevMessages) => [...prevMessages, message]); 
    });

    socketIo.on('notification', (notif) => {
      console.log("Notification received:", notif);
      setNotification(notif.description);  
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('sendMessage', message, (response) => {
        console.log('Server response:', response);
      });
      setReceivedMessages((prevMessages) => [...prevMessages, message]); 
      setMessage(''); 
    }
  };

  return (
    <div className="App">
      <h1>WebSocket Client</h1>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message"
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <div>
        <h3>Messages from Server:</h3>
        {receivedMessages.map((msg, index) => (
          <div key={index}>
            <p>{msg}</p> 
          </div>
        ))}
      </div>

      {notification && (
        <div>
          <h3>Notification:</h3>
          <p>{notification}</p> 
        </div>
      )}
    </div>
  );
}

export default App;
