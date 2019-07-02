const express = require('express');
const router  = express.Router();
const User    = require("../models/User");
const Exercise    = require("../models/Exercise");

router.post('/new-user', (req, res) => {
  let name = req.body.name;
  let user = { name };
  console.log(user);
  User
    .create(user)
    .then(newUser => {
      res.json(newUser);
    })
    .catch( err => res.status(500).send(`Something broke! => ${err}`));
});

router.post('/add', (req, res) => {
  let { _id, description, duration, date }  = req.body.exercise;
  date = new Date(date);
  console.log( _id, description, duration, date );
  Exercise
    .create({ description, duration, date })
    .then(newExercise => {
      User
        .findOne({ _id })
        .then(foundUser => {
          //add new exercise to the users exercise list
          foundUser.exerciseList.push(newExercise);

          //save user
          foundUser
            .save()
            .then(() => {
              //find the user and populate the exercise list
              User
                .findOne({ _id })
                .populate('exerciseList')
                .exec((err, foundUser) => {
                  if(err) res.status(500).send(`Something broke! => ${err}`);
  
                  res.json({ foundUser, newExercise });
                });
              }, 
              err => res.status(500).send(`Something broke! => ${err}`));              
        })
        .catch( err => res.status(500).send(`Something broke! => ${err}`));  
    })
    .catch( err => res.status(500).send(`Something broke! => ${err}`));
});

router.get('/log/:_id/:from?/:to?/:limit?', (req, res) => {
  let { _id, from, to, limit } = req.params; //."5d19bb9ee331345464cbad3b"
  console.log( _id, from, to, limit );
  User
    .findOne({ _id })
    .populate('exerciseList')
    .exec((err, foundUser) => {
      if(err) res.status(500).send(`Something broke! => ${err}`);

      res.json(foundUser);
    });
});

module.exports = router;