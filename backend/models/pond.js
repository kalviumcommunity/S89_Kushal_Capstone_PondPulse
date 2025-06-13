  const mongoose = require('mongoose');

  const pondSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      default: 0,
    },
    ph: {
      type: Number,
      default: 7.0,
    },
    oxygenLevel: {
      type: Number,
      default: 0,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
  }, { timestamps: true });
 
  module.exports = mongoose.model('Pond', pondSchema);
