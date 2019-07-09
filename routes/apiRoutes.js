const express = require('express');
const router  = express.Router();
const helpers = require('../helpers/helpers')

router.post('/new-user', (req, res) => {
  let name = req.body.name;
  let user = { name };

  if(!name) throw new Error("user name cannot be empty");

  // addNewUser(user, res);
  helpers.addNewUser(user, res);
});

router.post('/add', (req, res) => {
  let { id, description, duration, date }  = req.body.exercise;
  date = (date === "") ? undefined : date;

  //validate user id and date
  if(!id) throw new Error("user id cannot be empty");
  if(date !== undefined && (new Date(date)).toString() === "Invalid Date") throw new Error("please enter a valid date");

  helpers.addNewExercise({ id, description, duration, date }, res);
});

router.get('/log', (req, res) => {
  let { userId, from, to, limit } = req.query;

  if(from) from = new Date(from);
  if(to) to = new Date(to);

  //set the dates if no dates are passed in
  if(from === undefined) from = new Date(0);
  if(to === undefined) to = new Date(Date.now())
  
  if(from.toString() === "Invalid Date") throw new Error("please enter a valid date");
  if(to.toString() === "Invalid Date") throw new Error("please enter a valid date");

  helpers.logQuery({ id: userId, from, to, limit }, res);
});

module.exports = router;