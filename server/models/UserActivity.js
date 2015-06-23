var mongoose = require('mongoose');

var userActivity = new mongoose.Schema({
  activity_id: Number,
  time: Number,
  distance: Number,
  calory: Number,
  datetime: Date
});

module.exports = mongoose.model('UserActivity', userActivity);