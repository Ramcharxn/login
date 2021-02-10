const mongoose = require('mongoose');

const ValueSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Value = mongoose.model('Value', ValueSchema);

module.exports = Value;