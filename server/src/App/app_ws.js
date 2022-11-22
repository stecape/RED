module.exports = function () {
  const app_config = require('./app_config')
  var path = require('path');
  var cors = require('cors');
  var express = require('express')
  var app = express()
  app.use(cors());
  app.use(express.json())
  var http = require('http').Server(app);
  var io = require('socket.io')(http, { cors: { origin: '*' } });

  var connection = io.on('connection', s => {
    console.log('socket.io connection')
    return s
  });
  http.listen(app_config.ws_port, () => console.log('listening on http://localhost:'+app_config.ws_port+'/'));
  return {connection: connection, expressApp:app}
}