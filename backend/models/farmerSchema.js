  const mongoose = require('mongoose');
 
  const farmerSchema = new mongoose.Schema({
    name: {
      type: String,
       required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ponds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pond' }],
  }, { timestamps: true });
  
  const Farmer = mongoose.model('Farmer', farmerSchema);
  module.exports = Farmer;
