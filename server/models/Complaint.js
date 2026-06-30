const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['hygiene', 'quality', 'quantity', 'delay', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'  // every complaint starts as pending
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);