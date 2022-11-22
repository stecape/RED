const db_filler = require('./src/DB/db_filler')
const db_listener = require('./src/DB/db_listener')
const app_ws = require('./src/App/app_ws')
const app_api = require('./src/App/app_api')


//Socket IO init
var wsRet = app_ws()
var ReactWSConnection = wsRet.connection
var expressApp = wsRet.expressApp

//DB filling
var pool
db_filler().then(()=>{
  //DB events listening and emitter toward React websocket
  db_listener(ReactWSConnection).then((pool) => app_api(expressApp, pool))
})
