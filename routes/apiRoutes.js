const express = require('express');
const router  = express.Router();
const User    = require("../models/User");
const Exercise    = require("../models/Exercise");

router.post('/new-user', (req, res) => {
  let name = "Dilan Livera";
  let user = { name };
  User
    .create(user)
    .then(newUser => {
      res.json(newUser);
    })
    .catch( err => res.status(500).send(`Something broke! => ${err}`));
});

router.post('/add', (req, res) => {
  let name = "Dilan Livera";
  let description = "Exercise description."
  let duration = 100;
  let date = new Date(Date.now());
  let user;

  User
    .findOne({ name })
    .then(foundUser => {
      user = foundUser;
      let { _id } = foundUser; // needs to fix if user id is null
      return Exercise.create({ description, duration, date });
    })
    .then(newExercise => {
      //add new exercise to the users exercise list
      user.exerciseList.push(newExercise);

      //save user
      user
        .save()
        .then(() => {
            //find the user and populate the exercise list
            User
              .findOne({ _id : user._id })
              .populate('exerciseList')
              .exec((err, foundUser) => {
                if(err) res.status(500).send(`Something broke! => ${err}`);

                res.json({ foundUser, newExercise });
              });
          }, 
          err => res.status(500).send(`Something broke! => ${err}`));
    })  
    .catch( err => res.status(500).send(`Something broke! => ${err}`));
});

router.get('/log', (req, res) => {
  res.send('This is the api/exercise log route');
});

module.exports = router;