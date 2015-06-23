var mongoose = require('mongoose');

var userBody = new mongoose.Schema({
  body_id: Number,
  value: Number,
  date: Date
});

module.exports = mongoose.model('UserBody', userBody);