const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.send("hello world");
})

app.post('/', function(req, res){
  if (req.body){
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text == ''){
      response = `CON Welcome to a simple registration app
      What is your Name?`;
    } else {
      response = `END thank you for regiserstering, your name is ${text}`;
    }

    res.send(response);

      // add phone number to mongoose schema.
  } else {
    res.send("CON required parameters not provided");
  }
})

app.listen(port, function(){
  console.log("app running on port " + port);
})
