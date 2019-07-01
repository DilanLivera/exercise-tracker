// init project
const express   = require('express');
const app       = express();
const apiRouter = require("./routes/apiRoutes");
const PORT      = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/api/exercise', apiRouter);

//home route
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//middlewear for errors
app.use((req, res) => {
  res.status(404).send('Page Not Found!!!');
  res.status(500).send('Something broke!')
});

// listen for requests
const listener = app.listen(PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
