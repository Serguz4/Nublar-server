const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIO = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado:', socket.id);
  });
});

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
