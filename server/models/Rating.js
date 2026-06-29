const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  student: {
    // ObjectId links this rating to a User document
    // ref: 'User' lets us use .populate() to get full user details
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);