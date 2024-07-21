const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const i18next = require('./config/i18nextConfig');
const i18nextMiddleware = require('i18next-express-middleware');
const User = require('./models/User');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const locationRoutes = require('./routes/locationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const pollRoutes = require('./routes/pollRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statusRoutes = require('./routes/statusRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const storyRoutes = require('./routes/storyRoutes');
const friendRequestRoutes = require('./routes/friendRequestRoutes');
const { jwtMiddleware } = require('./middlewares/authMiddleware');
const moderateContent = require('./middlewares/contentModerationMiddleware');
const upload = require('./middlewares/fileUploadMiddleware');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(helmet()); // Add security headers
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(i18nextMiddleware.handle(i18next));


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
app.use('/api/location', locationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/announcement', announcementRoutes);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
    io.to(message.chatId).emit('deliveryReceipt', { messageId: newMessage._id, status: 'delivered' });
  });

  socket.on('typing', ({ userId, chatId }) => {
    io.to(chatId).emit('typing', { userId, chatId });
  });

  socket.on('privateMessage', async ({ senderId, receiverId, message }) => {
    const newMessage = await savePrivateMessageToDb(senderId, receiverId, message);
    io.to(receiverId).emit('privateMessage', newMessage);
  });

  socket.on('sendNotification', (notification) => {
    io.to(notification.userId).emit('notification', notification);
  });

  socket.on('updateLocation', async ({ userId, location }) => {
    const updatedUser = await updateUserLocation(userId, location);
    io.emit('locationUpdate', updatedUser);
  });

  // Audio/Video call events
  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  // Story events
  socket.on('postStory', async (story) => {
    const newStory = await saveStoryToDb(story);
    io.emit('newStory', newStory);
  });

  socket.on('reactToStory', async (reactionData) => {
    const updatedStory = await reactToStoryDb(reactionData);
    io.emit('storyReaction', updatedStory);
  });

  socket.on('viewStory', async (viewData) => {
    const updatedStory = await viewStoryDb(viewData);
    io.emit('storyViewed', updatedStory);
  });

  socket.on('messageRead', ({ userId, messageId }) => {
    io.to(userId).emit('messageRead', { messageId, status: 'read' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    User.findByIdAndUpdate(socket.request.user.id, { lastSeen: new Date() }, { new: true }).exec();
  });
});

const saveMessageToDb = async (message) => {
  // Implementation to save message to database
};

const savePrivateMessageToDb = async (senderId, receiverId, message) => {
  // Implementation to save private message to database
};

const saveStoryToDb = async (storyData) => {
  try {
    const story = new Story(storyData);
    await story.save();
    return story;
  } catch (error) {
    console.error('Error saving story to database:', error);
    throw new Error('Error saving story to database');
  }
};

const reactToStoryDb = async (reactionData) => {
  try {
    const { storyId, userId, reaction } = reactionData;
    const story = await Story.findById(storyId);

    const existingReaction = story.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      existingReaction.type = reaction;
    } else {
      story.reactions.push({ userId, type: reaction });
    }

    await story.save();
    return story;
  } catch (error) {
    console.error('Error reacting to story:', error);
    throw new Error('Error reacting to story');
  }
};

const viewStoryDb = async (viewData) => {
  try {
    const { storyId, userId } = viewData;
    const story = await Story.findById(storyId);

    if (!story.views.includes(userId)) {
      story.views.push(userId);
      await story.save();
    }

    return story;
  } catch (error) {
    console.error('Error viewing story:', error);
    throw new Error('Error viewing story');
  }
};

const updateUserLocation = async (userId, location) => {
  try {
    const user = await User.findById(userId);
    user.location = location;
    await user.save();
    return user;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw new Error('Error updating user location');
  }
};

module.exports = { app, server };
