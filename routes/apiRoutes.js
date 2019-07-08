const express = require('express');
const router  = express.Router();
const User    = require("../models/User");
const Exercise    = require("../models/Exercise");

router.post('/new-user', (req, res) => {
  let name = req.body.name;
  let user = { name };

  if(!name) throw new Error("user name cannot be empty");

  addNewUser(user, res);
});

router.post('/add', (req, res) => {
  let { id, description, duration, date }  = req.body.exercise;
  date = (date === "") ? undefined : date;

  //validate user id and date
  if(!id) throw new Error("user id cannot be empty");
  if(date !== undefined && (new Date(date)).toString() === "Invalid Date") throw new Error("please enter a valid date");

  addNewExercise({ id, description, duration, date }, res);
});

router.get('/log', (req, res) => {
  let { id, from, to, limit } = req.query;

  if(from) from = new Date(from);
  if(to) to = new Date(to);

  //set the dates if no dates are passed in
  if(from === undefined) from = new Date(0);
  if(to === undefined) to = new Date(Date.now())
  
  if(from.toString() === "Invalid Date") throw new Error("please enter a valid date");
  if(to.toString() === "Invalid Date") throw new Error("please enter a valid date");

  logQuery({ id, from, to, limit }, res);
});

module.exports = router;

function addNewUser(user, res) {
  User
  .find(user)
  .then(foundUser => {
    if(foundUser.length) throw new Error('username exists.');
    else return User.create(user);
  })
  .then(newUser => {
    let { id, name } = newUser;
    res.json({ id, name });
  })    
  .catch( err => res.status(500).json({
    error: {
      message: err.message
    }
  }));
}

function addNewExercise(exercise, res) {
  let { id, description, duration, date } = exercise;

  Exercise
    .create({ description, duration, date })
    .then(newExercise => {      
      User
        .findOne({ id })
        .then(foundUser => {
          //check if user exists
          if(foundUser) {
            //add new exercise to the users exercise list
            foundUser.exerciseList.push(newExercise);
            
            //save user
            foundUser
              .save()
              .then(() => {
                //find the user and populate the exercise list
                User
                  .findOne({ id })                
                  .populate('exerciseList', 'description duration date -_id')
                  .exec((err, foundUser) => {                  
                    if(err) throw err;
                    let { id, name, exerciseList } = foundUser;

                    res.json({ id, name, exerciseList });
                  });
                })
            .catch( err => res.status(500).send(err.message));
          }
          else throw new Error("user doesn't exist!!!")
        })
        .catch( err => res.status(500).json({
          error: {
            message: err.message
          }
        }));
    })
    .catch( err => {
      res.status(500).json({
        error: {
          message: err.message
        }
      });
    });
}

function logQuery(query, res) {
  let { id, from, to, limit } = query;

  // find user
  User
  .findOne({ id })
  //populte with query conditions
  .populate({
    path: 'exerciseList',
    match: {
      date: {
          $gt:  from,
          $lt:  to
      }
    },
    select: 'description duration date -_id',
    options: { 
      limit
    }
  })
  .exec((err, foundUser) => {
    if(err){
      res.status(500).json({
              error: {
                message: err.message
              }
            });
    }

    let { id, name, exerciseList } = foundUser;
    res.json({ id, name, exerciseList });
  });  
}