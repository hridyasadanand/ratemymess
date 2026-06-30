const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors());

connectDB();
app.set('io', io);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const ratingRoutes = require('./routes/ratings');
app.use('/api/ratings', ratingRoutes);
const complaintRoutes = require('./routes/complaints');
app.use('/api/complaints', complaintRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'RateMyMess API is running' });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});