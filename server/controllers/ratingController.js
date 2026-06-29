const Rating = require('../models/Rating');

// submit a rating
const createRating = async (req, res) => {
  try {
    const { mealType, stars, comment } = req.body;

    // req.user.id comes from authMiddleware — decoded from JWT
    // we never trust client to send their own id — security risk
    const rating = await Rating.create({
      student: req.user.id,
      mealType,
      stars,
      comment
    });

    // populate replaces student ID with actual student object
    const populated = await rating.populate('student', 'name email');

    // emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('new_rating', populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all ratings
const getRatings = async (req, res) => {
  try {
    // find all → populate student name → sort newest first
    const ratings = await Rating.find({})
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get average stars per meal type
const getAverages = async (req, res) => {
  try {
    // aggregate = process data in stages inside MongoDB
    const averages = await Rating.aggregate([
      {
        $group: {
          _id: '$mealType',            // group by meal type
          avgStars: { $avg: '$stars' }, // calculate average stars
          count: { $sum: 1 }            // count total ratings
        }
      }
    ]);

    res.status(200).json(averages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRating, getRatings, getAverages };