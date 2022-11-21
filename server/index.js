
const db_dialect = 'postgres'
const db_port =5432
const db_host ='host.docker.internal'
const db_name ='postgres'
const db_user ='postgres'
const db_password ='postgrespw'

const ws_port = 3001


/////////////////////Socket.io Server Stuff///////////////////////////////
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { cors: { origin: '*' } });
var listener
app.get('/', (req, res) => {
  console.log('express connection');
  res.sendFile(path.join(__dirname, 'si.html'));
});
io.on('connection', s => {
  console.log('socket.io connection')
  listener = s
});
http.listen(ws_port, () => console.log('listening on http://localhost:3001/'));
/////////////////////Socket.io Server Stuff Fine///////////////////////////////

/////////////////////Event Listener Stuff///////////////////////////////
//You cannot keep the connection open with sequelize, so this part must be done with pg
const pg = require ('pg')
// Creation of the pool to connect to postgres -> sostituire l'host di docker eventualmente con localhost
const connStr = db_dialect + '://' + db_user + ':' + db_password + '@' + db_host + ':' + db_port + '/' + db_name
var pool = new pg.Pool({connectionString: connStr})

// Creation of the callback that calls pg_notify -> Can also be done with sequelize (better with pg maybe, sequelize need a fixing in the trigger creation - see README.MD)
pool.query("CREATE OR REPLACE FUNCTION return_data() RETURNS trigger AS $BODY$ BEGIN PERFORM pg_notify('rts_changes', row_to_json(NEW)::text); RETURN NULL; END; $BODY$ LANGUAGE plpgsql VOLATILE COST 100",
  (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    } else {
      console.log("Function created: ", result)
      // Creation of the trigger that calls the callback
      pool.query("CREATE OR REPLACE TRIGGER \"RTsCh\" AFTER UPDATE ON \"RTs\" FOR EACH ROW EXECUTE PROCEDURE return_data();",
      (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        } else {
          console.log('Trigger created: ', result)
        }
      })
    }
})


// Creating the connection that will remains on listen for notifications
pool.connect(function(err, client) {
  if(err) {
    console.log(err);
  }else{
    console.log ("pool connected")
  }

  // Listen for all pg_notify channel messages
  client.on('notification', function(msg) {
    let payload = JSON.parse(msg.payload);
    console.log(payload)
    listener.emit('message', payload.value)
  });
  
  // Designate which channels we are listening on. Add additional channels with multiple lines.
  client.query('LISTEN rts_changes');
});
/////////////////////Event Listener Stuff Fine///////////////////////////////


/////////////////////Sequelize Stuff///////////////////////////////
///* 
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  port: db_port,
  dialect: db_dialect
});

//Models definition and tables filling, done just the first time 
const Tag = sequelize.define('Tag', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

const Connection = sequelize.define('Connection', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  partner: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

const RT = sequelize.define('RT', {
  // Model attributes are defined here
  value: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false
  }
}, {
}); 

//Relations def
Connection.hasMany(Tag)
Tag.belongsTo(Connection)

Tag.hasOne(RT)
RT.belongsTo(Tag)

//Tables filling
sequelize.sync({ force: true }).then(() => {
  console.log('Sync done');
  Connection.create({name: 'Mqtt_1', type: 'mqtt', partner: 'PLC1'})
  Connection.create({name: 'Mqtt_2', type: 'mqtt', partner: 'PLC2'})
  Connection.create({name: 'Mqtt_3', type: 'mqtt', partner: 'PLC3'})
  Tag.create({name: 'Speed', type: 'udtSetAct', ConnectionId: 2})
  RT.create({value: 2.0, TagId: 1})//.then(() => functionAndTrigger())
}).catch(err => {
  console.error('Something went wrong syncing:', err);
})

const queryInterface = sequelize.getQueryInterface();

//Trigger and functions creation. This should be done async!!! It's called after last RTs table filling in the sequelize.sync callback.
//Better with pg because the createTrigger in the actual version of sequelize is bugged
/*
const functionAndTrigger = () => {
  queryInterface.createFunction(
    "return_data",
    [],
    "trigger",
    "plpgsql",
    "PERFORM pg_notify('rts_changes', row_to_json(NEW)::text); RETURN NULL;",
    ["VOLATILE", "COST 100"],
    {force: true}
  ).then(()=>{
    queryInterface.createTrigger(
      "RTs",
      "RTsCh",
      "after",
      ["update"],
      "public.return_data",
      [],
      ["FOR EACH ROW"],
      {force: true}
    )
})}
*/
/////////////////////Sequelize Stuff Fine///////////////////////////////
