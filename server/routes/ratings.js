const express = require('express');
const router = express.Router();
const { createRating, getRatings, getAverages } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

// protect runs BEFORE controller
// no valid token = request stops here
router.post('/', protect, createRating);
router.get('/', protect, getRatings);
router.get('/averages', protect, getAverages);

module.exports = router;