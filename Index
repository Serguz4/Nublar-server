const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error conectando:', err));

// Esquemas
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  nickname: String
}));

const Message = mongoose.model('Message', new mongoose.Schema({
  room: String,
  sender: String,
  content: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, expires: 60, default: Date.now }
}));

// Rutas
app.post('/register', async (req, res) => {
  const { email, nickname } = req.body;
  await new User({ email, nickname }).save();
  res.json({ message: 'Usuario registrado' });
});

app.get('/users/count', async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Conectado:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('send_message', async (data) => {
    const { room, sender, content, type } = data;
    const msg = new Message({ room, sender, content, type });
    await msg.save();
    io.to(room).emit('receive_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
