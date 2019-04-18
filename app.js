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
    const { sessionId, serviceCode, phoneNum, text } = req.body;
    //connect db and check if the user is already in our db by using their phoneNumber
    connectdb(()=>{
      db.collection(env.db.userColl).findOne({phoneNumber:phoneNum}, (err, result)=>{
        if (err == null && result != null ){
          //console.log(`User ${phoneNumber} has already been registered with us`);
          if (result[serviceCode]){
            if (text){
              connectdb(()=>{
                let num = result[serviceCode]['current'];
                let obj1 = {}
                obj1[serviceCode] = survey[serviceCode];
                obj1[serviceCode]['answers'][num] = text;
                obj1[serviceCode]['current'] = (num+1);
                //save answer to db
                db.collection(env.db.userColl).updateOne({phoneNumber:phoneNum},
                  {$set: obj1}, (err) => {
                  if (err){
                    console.log(err);
                  }else{
                    console.log('Successfully added answer');
                  }
                  response = result[serviceCode]['quiz'][(num+1)];
                  //send response
                  res.send(response);
                })
              })

            }else{
              response = result[serviceCode]['quiz'][result[serviceCode]['current']] + " This question is mandatory for you to proceed";
              //send response
              res.send(response);
            }

          } else {
            connectdb(()=>{
              db.collection(env.db.userColl).updateOne({phoneNumber:phoneNum}, {$set: {[serviceCode]: survey[serviceCode]}}, (err) => {
                if (err){
                  console.log(err);
                }else{
                  console.log('Successfully creating new survey for user');
                  response = survey[serviceCode]['quiz'][survey[serviceCode]['current']];
                  //send response
                  res.send(response);
                }
              })
            })
          }
        }else{
          console.log('Error finding given user \n' + err);
          //start registering new user
          connectdb(()=>{
            let dataset = {phoneNumber:phoneNum, [serviceCode]:survey[serviceCode]};

            db.collection(env.db.userColl).insertOne(dataset, (err) =>{
              if (err){
                console.log('Trouble adding new user' + err);
              }
              console.log("[DATASET]" + typeof(dataset[serviceCode]['quiz'][dataset[serviceCode]['current']]));
              response = dataset[serviceCode]['quiz'][dataset[serviceCode]['current']];
              //send response
              res.send(response)
            })
          })
        }
      })
    });
  } else {
    // if no body exits send an error missing parameters
    response = "END System error! Required parameters not provided. Please try again later.";
    //send response
    res.send(response);
  }
})

app.listen(port, function(){
  console.log("app running on port " + port);
})


//helper functions
//connect to db
function connectdb(callback){
  MongoClient.connect(mongoDBUrl, {useNewUrlParser:true}, function(err, client){
    try{
      if (err == null){
        db = client.db(dbName);
        callback();
      } else {
        console.log("[WARNING]: ERROR CONNECTING TO MONGO DB TRY RESTARTING APP");
      }
    } finally{
      client.close();
    }
  })
}

//Questions json
const survey = {
  "234232" :{
    'current':0,
    'quiz':{
      0:"CON Welcome to a simple registration app. What is your full name?",
      1:"CON How old are you?",
      2:"CON Where do you stay?",
      3:"END Thank you for registering."
    },
    'answers':{
      0:null,
      1:null,
      2:null,
      3:null
    }
  },
  "4232" :{
    'current':0,
    'quiz':{
      0:"CON I would love to know more about you. Where do you study?",
      1:"CON What's your favorite color?",
      2:"CON What is your favorite drink?",
      3:"END Thank you."
    },
    'answers':{
      0:null,
      1:null,
      2:null,
      3:null
    }
  }
}
