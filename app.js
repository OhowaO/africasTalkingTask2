const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.send("hello world");
})

app.post('/', function(req, res){
  console.log(req);
})

app.listen(port, function(){
  console.log("app running on port " + port);
})
