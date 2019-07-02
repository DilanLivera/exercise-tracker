// init project
require('dotenv').config();
const express     = require('express');
const app         = express();
const bodyparser  = require("body-parser");
const mongoose    = require("mongoose");
const apiRouter   = require("./routes/apiRoutes");
const PORT        = process.env.PORT || 3000;
const DATABASEURL = process.env.DATABASEURL;

//set up mongoose
mongoose.set('debug', true);
mongoose.connect(DATABASEURL, { useNewUrlParser: true });
mongoose.Promise = Promise;

app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/exercise', apiRouter);

//home route
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//middlewear for errors
app.use((req, res, next) => {
  const error = new Error("Page Not Found!!!");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  });
});

// listen for requests
const listener = app.listen(PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
