import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import axios from 'axios'
const socket = io("ws://localhost:3001");

const inc = (TagId, value) => {
  axios.post('http://localhost:3001/api/setTag', { TagId: TagId, value: value+1 })
  .then(function (response) {
    //console.log("inc response: ", response);
  })
  .catch(function (error) {
    console.log("inc error: ", error);
  });
}

const dec = (TagId, value) => {
  axios.post('http://localhost:3001/api/setTag', { TagId: TagId, value: value-1 })
  .then(function (response) {
    //console.log("dec response: ", response);
  })
  .catch(function (error) {
    console.log("dec error: ", error);
  });
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [machineSpeed, setMachineSpeed] = useState(socket.machineSpeed);
  

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      axios.post('http://localhost:3001/api/getTag', { TagId: 1 })
        .then(response => {
          //console.log(response.data)
          setMachineSpeed(response.data.value)
        });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.io.on("error", (error) => {
      console.log(error)
    });

    socket.on("message", (value) => {
      setMachineSpeed(value)
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
        <p>Machine Speed: { '' + machineSpeed }</p>
        <p><button onClick={() => dec(1, machineSpeed)}><p> - </p></button> <button onClick={() => inc(1, machineSpeed)}><p> + </p></button></p>
      </header>
    </div>
  );
}

export default App;
