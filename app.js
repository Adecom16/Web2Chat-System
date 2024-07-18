const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const User = require('./models/User');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const utilityRoutes = require('./routes/utilityRoutes'); 
const friendRequestRoutes = require('./routes/friendRequestRoutes');
const { jwtMiddleware } = require('./middlewares/authMiddleware');
const moderateContent = require('./middlewares/contentModerationMiddleware');
const upload = require('./middlewares/fileUploadMiddleware');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(helmet()); // Add security headers
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectDB();

app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/utilities', utilityRoutes); 
app.use('/api/friend-requests', friendRequestRoutes);

// Serve static files securely
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io setup
io.use((socket, next) => {
  jwtMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', ({ userId, chatId }) => {
    socket.join(chatId);
    console.log(`User ${userId} joined chat ${chatId}`);
    User.findByIdAndUpdate(userId, { lastSeen: new Date() }, { new: true }).exec();
  });

  socket.on('sendMessage', async (message) => {
    const newMessage = await saveMessageToDb(message);
    io.to(message.chatId).emit('message', newMessage);
  });

  socket.on('typing', ({ userId, chatId }) => {
    io.to(chatId).emit('typing', { userId, chatId });
  });

  // Audio/Video call events
  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    User.findByIdAndUpdate(socket.request.user.id, { lastSeen: new Date() }, { new: true }).exec();
  });
});

const saveMessageToDb = async (message) => {
  // Implementation to save message to database
};

module.exports = { app, server };
