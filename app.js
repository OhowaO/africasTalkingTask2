const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const env = require('./variables.js');

const app = express();

const port = env.port;
const dbName = env.db.dbName;
const mongoDBUrl = env.db.mongoDBUrl;
const survey = env.survey;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', function(req, res){
  res.send("Africa's Talking Technical Interview, see github README.md for more info");
})

app.post('/', function(req, res){
  // start creating response
  //check if there exists a body
  if (req.body){
    //save parameters
    const { sessionId, serviceCode, phoneNum, text } = req.body;
    //connect db and check if the user is already in our db by using their phoneNumber
    connectdb(()=>{
      db.collection(env.db.userColl).findOne({phoneNumber:phoneNum}, (err, result)=>{
        if (err == null && result != null ){
          if (result[serviceCode]){
            let num = result[serviceCode]['current'];
            if (text){
              connectdb(()=>{
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
                    console.log('Successfully added answer to database and incremented count');
                  }
                  response = result[serviceCode]['quiz'][(num+1)];
                  //send response
                  res.send(response);
                })
              })

            }else{
              response = result[serviceCode]['quiz'][num] + " This question is mandatory for you to proceed";
              //send response
              res.send(response);
            }

          } else {
            connectdb(()=>{
              db.collection(env.db.userColl).updateOne({phoneNumber:phoneNum}, {$set: {[serviceCode]: survey[serviceCode]}}, (err) => {
                if (err){
                  console.log(err);
                }else{
                  console.log('Successfully initialized new survey for user');
                  response = survey[serviceCode]['quiz'][survey[serviceCode]['current']];
                  //send response
                  res.send(response);
                }
              })
            })
          }
        }else{
          console.log('[Error]'+  err + '\nInitializing new user to database');
          //start registering new user
          connectdb(()=>{
            let dataset = {phoneNumber:phoneNum, [serviceCode]:survey[serviceCode]};

            db.collection(env.db.userColl).insertOne(dataset, (err) =>{
              if (err){
                console.log('Trouble adding new user' + err);
              }
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
