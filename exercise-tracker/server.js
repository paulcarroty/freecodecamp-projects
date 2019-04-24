const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')
const User = require('./models/user.js');
const Exercise = require('./models/exercise.js');


// create mongodb connection
mongoose.connect(process.env.MLAB_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to DB!'));


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});




// /api/exercise/new-user endpoint

app.post('/api/exercise/new-user', (req, res) => {
    
  let username = req.body.username;
  console.log('Username:', username )

  if(username == undefined || username.length < 2 || username.length > 12){
     
    res.send('Incorrect username. Only 2-12 characters is allowed')
     
  } else { 
    
    let addUser = new User({username});
  
    addUser.save((err, data) => {
      if (err) {
        err.code === 11000 
        ? res.send('This username is already used!')
        : res.send('Error occurred while saving user: ' + err);
      }
      else {
        res.json(data);
      }
      
    });
  
    
  }
});

 
  
  
  
  
// /api/exercise/add endpoint
app.post('/api/exercise/add', (req, res) => {
  let userId;
  let username = req.body.username;
  console.log(req.body)
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  
  const query = {};
  
  if(username === undefined || description === undefined || duration === undefined){
    
   res.send('Please provide all requested information.')

  } else if(username > 12 || username < 2){  
    res.send('Username should be 2..12 characters long!')
  } else if(username == '' || description == '' || duration == ''){
    res.send('Please provide all requested information.')
  } else if( duration > 180 || duration < 0){
    res.send("Duration can't be longer than 180 minutes")
  } else if (description > 1000){
    res.send("Description can't be longer than 1000 characters!")
  } else {
  
    
    User.findOne({ username }, (err, data) => {
      if (err) {
        res.send('Error: ' + err);
      } else if (!data) {
        res.send('Username not found');
      } else {
        
        // get date, duration and userId
        userId = data.id;
        duration = Number(duration);

        date === '' 
          ? date = new Date()
          : date = Date.parse(date);
        

        const newExercise = new Exercise({
          userId,
          description,
          duration,
          date,
        });

        newExercise.save((err, data) => {
          err  
          ? res.send('Save failed ' + err)
          : res.json(data);
          });
      }
    });
  }
});




// /api/exercise/log?{userId}[&from][&to][&limit] endpoint

app.get('/api/exercise/:log', (req, res) => {
  let username = req.query.username;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let userId;
  let query = {};
  console.log(req.query)

  if (username === undefined || username === '' || username.length > 12) {
    res.send('Bad username');
  } else if (from !== undefined && isNaN(Date.parse(from)) === true) {
    res.send("Bad 'From' date");
  } else if (to !== undefined && isNaN(Date.parse(to)) === true) {
    res.send("Bad 'To' date");
  } else if (limit !== undefined && isNaN(limit) === true || Number(limit) < 1) {
    res.send('Bad limit');
  } else {
    // find userId
    User.findOne({ username }, (err, data) => {
      if (err) {
        res.send('Search error: ' + err);
      } else if (!data) {
        res.send('Username not found');
      } else {
        
        // get data from query
        userId = data.id;
        query.userId = userId;

        from = new Date(from);
        query.date = { $gte: from};
        

        to = new Date(to);
        query.date = { $lt: to};
        limit = Number(limit);
  
        // run search query
        Exercise.find(query).select('userId description date duration ').limit(limit).exec((errExercise, exercises) => {
          if (err) {
            res.send('Search error ' + err);
          } else if (!data) {
            res.send('Exercises not found');
          } else {
            res.json(exercises);
          }
        });
      }
    });
  }
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


