const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', function(req, res){
  res.send("hello world");
})

app.post('/', function(req, res){
  //console.log(req);
  console.log('Callback noted');
  console.log('[BODY]' + req);
  res.send('CON menu is here');
})

app.listen(port, function(){
  console.log("app running on port " + port);
})
