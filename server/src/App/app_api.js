module.exports = function (app, pool) {
    
  //You cannot keep the connection open with sequelize, so this part must be done with pg
  const pg = require ('pg')

  app.get('/', (req, res) => {
    console.log('express connection');
    res.status(200).send('<p>Express.js BackEnd Server. Ciao!</p>')
  });

  app.post('/api/setTag', (req, res) => {
    var queryString="UPDATE \"RTs\" SET \"value\" = " + req.body.value + " where \"TagId\" = " + req.body.TagId; 
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      //console.log("setTag result: ", result.rows[0])
      res.status(201).json(result.rows[0])
    })
    .catch((error) => {
      //console.log("setTag error: ", error)
      res.status(400).send(error)
    });
  });

  app.post('/api/getTag', (req, res) => {
    var queryString="SELECT \"value\" from \"RTs\" where \"TagId\" = " + req.body.TagId; 
    pool.query({
      text: queryString,
      rowMode: 'array'
    }).then((data)=>{
      res.status(200).json({value: data.rows[0][0]})
    
    })
  });

}