const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
  try {
    // req.body contains what the client sent us as JSON
    const { name, email, password, role } = req.body;

    // check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 400 = Bad Request
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash the password — never store plain text passwords
    // 10 = salt rounds, higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and save new user to MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // create JWT token containing user id and role
    // process.env.JWT_SECRET is our secret key from .env
    // '7d' = token expires in 7 days
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 201 = Created successfully
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    // 500 = something broke on our server
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // compare entered password with hashed password in DB
    // returns true or false
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 401 = Unauthorized
      return res.status(401).json({ message: 'Wrong password' });
    }

    // generate token same as register
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };