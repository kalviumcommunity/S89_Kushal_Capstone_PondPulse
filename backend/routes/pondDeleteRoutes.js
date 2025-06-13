 const express = require('express');
 const router = express.Router();
 const Pond = require('../models/pond');
 const Farmer = require('../models/farmerSchema');

// ❌ Delete a pond by ID
 router.delete('/:id', async (req, res) => {
  try {
    const pond = await Pond.findByIdAndDelete(req.params.id);
    if (!pond) return res.status(404).json({ error: 'Pond not found' });

    // Remove reference from farmer
    const farmer = await Farmer.findById(pond.farmer);
    if (farmer) {
      farmer.ponds.pull(pond._id);
      await farmer.save();
    }

    res.status(200).json({ message: 'Pond deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pond' });
  }
 });

// ❌ Delete a farmer by ID (and optionally their ponds)
 router.delete('/farmer/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

    // Optionally delete all ponds associated with this farmer
    await Pond.deleteMany({ farmer: farmer._id });

    await farmer.deleteOne();
    res.status(200).json({ message: 'Farmer and associated ponds deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete farmer' });
  }
 });

 module.exports = router;
