const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;

    const complaint = await Complaint.create({
      student: req.user.id,  // from JWT, never trust client to send their own id
      category,
      description
    });

    const populated = await complaint.populate('student', 'name');

    // get socket.io instance we attached to app in server.js
    const io = req.app.get('io');

    // emit event to ALL connected clients instantly
    // 'new_complaint' = event name, frontend listens for this
    io.emit('new_complaint', populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('student', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin updates complaint status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;  // comes from URL: /api/complaints/abc123/status
    const { status } = req.body;

    // findByIdAndUpdate finds + updates in one step
    // { new: true } returns UPDATED document, not old one
    const updated = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getComplaints, updateStatus };