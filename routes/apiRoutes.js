const express = require('express');
const router = express.Router();

router.post('/new-user', (req, res) => {
  res.send('This is the api/exercise new-user route');
});

router.post('/add', (req, res) => {
  res.send('This is the api/exercise add route');
});

router.get('/log', (req, res) => {
  res.send('This is the api/exercise log route');
});

module.exports = router;