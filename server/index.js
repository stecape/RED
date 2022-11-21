const db_filler = require('./src/Constructor/db_filler')
const db_listener = require('./src/Constructor/db_listener')
const app_ws = require('./src/App/app_ws')

//Socket IO init
var connection = app_ws()

//DB filling
db_filler().then(()=>{
  //DB events listening
  db_listener(connection)
})
