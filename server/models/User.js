// mongoose helps us define the shape of data we store in MongoDB
const mongoose = require('mongoose');

// Schema = blueprint of how a User document looks in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true  // must be provided, MongoDB rejects if missing
  },
  email: {
    type: String,
    required: true,
    unique: true    // no two users can have same email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],  // only these two values allowed
    default: 'student'           // if not provided, becomes 'student'
  }
}, {
  timestamps: true  // auto adds createdAt and updatedAt fields
});

// mongoose.model turns schema into a usable Model
// MongoDB will create a collection called 'users' (auto lowercase+plural)
module.exports = mongoose.model('User', userSchema);