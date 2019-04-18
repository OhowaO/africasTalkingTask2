const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const env = require('./variables.js');

const app = express();

const port = env.port;
const dbName = env.db.dbName;
const mongoDBUrl = env.db.mongoDBUrl;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', function(req, res){
  res.send("Africa's Talking Technical Interview, see github README.md for more info");
})

app.post('/', function(req, res){
  // start creating response
  let response = '';
  //check if there exists a body
  if (req.body){
    //save parameters
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    //check if the user is already in our db by using their phoneNumber
    db.collection(env.db.userColl).findOne({id:phoneNumber}, (err, result)=>{
      if (err == null && result != null ){
        //console.log(`User ${phoneNumber} has already been registered with us`);
        console.log(result);
        //if user has already been registered check if their data is complete
      }else{
        console.log('Error finding given user \n' + err);
        //start registering user newly
      }
    })


    if (text == ''){
      response = `CON Welcome to a simple registration app
      What is your Name?`;
    } else {
      response = `END thank you for regiserstering, your name is ${text}`;
    }
  } else {
    // if no body exits send an error missing parameters
    response = "END System error! Required parameters not provided. Please try again later.";
  }
  //send response
  res.send(response);
})

app.listen(port, function(){
  console.log("app running on port " + port);
  MongoClient.connect(mongoDBUrl, {useNewUrlParser:true}, function(err, client){
    if (err == null){
      console.log("Successfully connected to the server")
      db = client.db(dbName);
    } else {
      console.log("[WARNING]: ERROR CONNECTING TO MONGO DB TRY RESTARTING APP");
    }
  })
})
