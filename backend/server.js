const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pondGetRoutes = require('./routes/pondGetRoutes');     
const pondPostRoutes = require('./routes/pondPostRoutes');  
const pondPutRoutes = require('./routes/pondPutRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/ponds', pondGetRoutes);   // GET routes
app.use('/api/ponds', pondPostRoutes);  // POST routes
app.use('/api/ponds', pondPutRoutes); // PUT routes

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));