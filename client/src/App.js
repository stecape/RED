import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
const socket = io("ws://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState(socket.message);
  
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.io.on("error", (error) => {
      console.log(error)
    });

    socket.on("message", (message) => {
      setMessage(message)
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Socket.io Connected: { '' + isConnected }</p>
        <p>Machine Speed: { '' + message }</p>
      </header>
    </div>
  );
}

export default App;
