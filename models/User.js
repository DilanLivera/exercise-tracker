const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  exerciseList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }]
});

module.exports = mongoose.model("User", userSchema);