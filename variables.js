//will set this as environment variables in future
const credentials = {
  "user":process.env.user,
  "password":process.env.password
}

const variables = {
  "port": process.env.PORT || 5000,
  "db":{
    "mongoDBUrl": `mongodb+srv://${credentials.user}:${credentials.password}@com-asperger-m3l5y.mongodb.net/test?retryWrites=true`,
    "dbName":"AT2-SimpleApp",
    "userColl":"userRegistration"
  },
  "survey":{
    "*384*234232#" :{
      'current':0,
      'quiz':{
        0:"CON Welcome to a simple registration app. What is your phoneNumber?",
        1:"What is your full name?",
        2:"What is your email?"
        3:"CON How old are you?",
        4:"CON Where do you stay?",
        5:"END Thank you for registering."
      },
      'answers':{
        0:null,
        1:null,
        2:null,
        3:null,
        4:null,
        5:null
      }
    },
    "*384*4232#" :{
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
}

module.exports = variables;
