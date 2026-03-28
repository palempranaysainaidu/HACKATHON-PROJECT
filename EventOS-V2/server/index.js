const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use Socket.IO helper (to be implemented)
const initSocket = require('./config/socket');
const io = initSocket(server);
app.set('io', io);

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.CLIENT_URL || origin === process.env.PROD_CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/organizer', require('./routes/organizer.routes'));
app.use('/api/volunteer', require('./routes/volunteer.routes'));
app.use('/api/attendee', require('./routes/attendee.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api', require('./routes/shared.routes')); // /api/venues, /api/settings, etc.

// Global Error Handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`EventOS V2 server running on port ${PORT}`));
