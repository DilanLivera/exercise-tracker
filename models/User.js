const mongoose = require('mongoose');
const shortId = require('shortid');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortId.generate
  },
  name: String,
  exerciseList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }]
});

module.exports = mongoose.model("User", userSchema);