// server.js (or index.js)

import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

/* ---------- HTTP + Socket.IO setup ---------- */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }          // 🔒 tighten this in production
});

/* ---------- Socket.IO auth & rooms ---------- */
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];

    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid projectId'));
    }

    socket.project = await projectModel.findById(projectId);
    if (!token)      return next(new Error('Authentication error'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)    return next(new Error('Authentication error'));

    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', socket => {
  socket.roomId = socket.project._id.toString();
  console.log('✅ User connected');
  socket.join(socket.roomId);

  socket.on('project-message', async data => {
    const { message } = data;

    /* Broadcast to everyone else first */
    socket.broadcast.to(socket.roomId).emit('project-message', data);

    /* If @ai is present, generate an AI reply */
    if (message.includes('@ai')) {
      const prompt  = message.replace('@ai', '').trim();
      const result  = await generateResult(prompt);

      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          _id:   'ai',
          email: 'AI'
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
    socket.leave(socket.roomId);
  });
});

/* ---------- Bootstrap: connect DB, then start server ---------- */
async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);  // stop the process if the DB is unreachable
  }
}

bootstrap();
