const express = require('express');
const router  = express.Router();
const User    = require("../models/User");
const Exercise    = require("../models/Exercise");

router.post('/new-user', (req, res) => {
  let name = req.body.name;
  let user = { name };

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
    .catch( err => {
      res.send(err.message);
    });
});

router.post('/add', (req, res) => {
  let { id, description, duration, date }  = req.body.exercise;
  date = new Date(date);
  
  Exercise
    .create({ description, duration, date })
    .then(newExercise => {      
      User
        .findOne({ id })
        .then(foundUser => {
          //add new exercise to the users exercise list
          foundUser.exerciseList.push(newExercise);
          
          //save user
          foundUser
            .save()
            .then(() => {
              //find the user and populate the exercise list
              User
                .findOne({ id })                
                .populate('exerciseList', 'description duration date')
                .exec((err, foundUser) => {                  
                  if(err) res.status(500).send(`Something broke! => ${err}`);
                  let { id, name, exerciseList } = foundUser;

                  res.json({ id, name, exerciseList });
                });
              }, 
              err => res.status(500).send(`Something broke! => ${err}`));              
        })
        .catch( err => res.status(500).send(`Something broke! => ${err}`));  
    })
    .catch( err => res.status(500).send(`Something broke! => ${err}`));
});

router.get('/log/:id/:from?/:to?/:limit?', (req, res) => {
  let { id, from, to, limit } = req.params;
  from = new Date('2014-01-01');
  to = new Date('2020-01-01');
  limit = 2;
  
  //find user
  User
    .findOne({ id })
    //populte with query
    .populate({
      path: 'exerciseList',
      match: {
        date: {
            $gt:  from,
            $lt:  to
        }
      },
      select: 'description duration date',
      options: { 
        limit
      }
    })
    .exec((err, foundUser) => {
      if(err) res.status(500).send(`Something broke! => ${err}`);

      let { id, name, exerciseList } = foundUser;
      res.json({ id, name, exerciseList });
    });
});

module.exports = router;