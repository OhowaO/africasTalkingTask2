const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', function(req, res){
  res.send("Africa's Talking Technical Interview, see github README.md for more info");
})

app.post('/', function(req, res){
  //check if there exists a body
  if (req.body){
    //save parameters
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    // start creating response
    let response = '';

    if (text == ''){
      response = `CON Welcome to a simple registration app
      What is your Name?`;
    } else {
      response = `END thank you for regiserstering, your name is ${text}`;
    }
    //send response
    res.send(response);

      // add phone number to mongoose schema.
  } else {
    // if no body exits send an error missing parameters
    res.send("CON required parameters not provided");
  }
})

app.listen(port, function(){
  console.log("app running on port " + port);
})
