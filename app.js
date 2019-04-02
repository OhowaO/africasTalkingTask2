const express = require('express');
const app = express();
const port = 3030;

app.get('/', function(req, res){
  res.send("hello world");
})

// app.post('/', function(req, res){
//   res.send(req);
// })

app.listen(port, function(){
  console.log("app running on port " + port);
})
