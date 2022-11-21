module.exports = function () {
  const app_config = require('./app_config')
  var path = require('path');
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http, { cors: { origin: '*' } });

  app.get('/', (req, res) => {
    console.log('express connection');
    res.status(200).send('<p>Express.js BackEnd Server. Ciao!</p>')
  });

  var connection = io.on('connection', s => {
    console.log('socket.io connection')
    return s
  });
  http.listen(app_config.ws_port, () => console.log('listening on http://localhost:3001/'));
  return connection
}