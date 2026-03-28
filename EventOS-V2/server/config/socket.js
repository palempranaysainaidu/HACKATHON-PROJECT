const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL, process.env.PROD_CLIENT_URL],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_event_chat', ({ eventId }) => {
      socket.join(`event_${eventId}`);
      console.log(`Socket ${socket.id} joined room event_${eventId}`);
    });

    socket.on('send_message', async ({ eventId, senderId, senderName, message, taskGroup }) => {
      // In a real app we'd save to DB here, but for now we emit back immediately
      const ChatMessage = require('../models/ChatMessage');
      try {
        const saved = await ChatMessage.create({ eventId, senderId, senderName, message, taskGroup });
        io.to(`event_${eventId}`).emit('receive_message', saved);
      } catch (err) {
        console.error('Socket message save error', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
