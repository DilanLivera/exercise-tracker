const User    = require("../models/User");
const Exercise    = require("../models/Exercise");
let helpers = {};

helpers.addNewUser = function (user, res) {
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

helpers.addNewExercise = function (exercise, res) {
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

                    res.json(updateExerciseList(foundUser));
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

helpers.logQuery = function (query, res) {
  let { id, from, to, limit } = query;

  try{
    if(!id) throw new Error("please enter a valid userId");
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
        throw err;
      }    

      res.json(updateExerciseList(foundUser));
    });     
  } catch(err) {
    res.status(500).json({
      error: {
        message: err.message
      }
    });
  }
 
}

//update passed in user's exercise list
function updateExerciseList(user){
  let { id, name, exerciseList } = user;

  let updatedExerciseList = exerciseList.map(exercise => {
    let { date, description, duration } = exercise;
    date = date.toDateString();
    return { date, description, duration };
  });

  return { id, name, exerciseList: updatedExerciseList };
}

module.exports = helpers;