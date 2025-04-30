// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pondGetRoutes = require('./routes/pondRoutes');      // GET
const pondPostRoutes = require('./routes/pondPostRoutes'); // POST

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use('/api/ponds', pondGetRoutes);   // GET routes
app.use('/api/ponds', pondPostRoutes);  // POST routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));