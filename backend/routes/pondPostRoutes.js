const express = require('express');
const router = express.Router();
const Pond = require('../models/pond');
const Farmer = require('../models/farmerSchema');

// Create a new farmer
router.post('/farmer', async (req, res) => {
  try {
    const { name, email } = req.body;
    const farmer = new Farmer({ name, email });
    await farmer.save();
    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create farmer' });
  }
});

// Create a new pond and assign to farmer
router.post('/', async (req, res) => {
  try {
    const { name, location, temperature, ph, oxygenLevel, farmerId } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const pond = new Pond({ name, location, temperature, ph, oxygenLevel, farmer: farmerId });
    await pond.save();

    farmer.ponds.push(pond._id);
    await farmer.save();

    res.status(201).json(pond);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pond' });
  }
});

// Create multiple ponds
router.post('/multi', async (req, res) => {
  try {
    const { ponds, farmerId } = req.body;

    if (!Array.isArray(ponds)) return res.status(400).json({ error: 'Ponds must be an array' });

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

    const createdPonds = await Pond.insertMany(ponds.map(p => ({ ...p, farmer: farmerId })));
    farmer.ponds.push(...createdPonds.map(p => p._id));
    await farmer.save();

    res.status(201).json(createdPonds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create multiple ponds' });
  }
});

// Assign existing pond to farmer
router.post('/farmer/:id/assign-pond', async (req, res) => {
  try {
    const { pondId } = req.body;
    const farmer = await Farmer.findById(req.params.id);
    const pond = await Pond.findById(pondId);

    if (!farmer || !pond) return res.status(404).json({ error: 'Farmer or Pond not found' });

    pond.farmer = farmer._id;
    await pond.save();

    if (!farmer.ponds.includes(pond._id)) {
      farmer.ponds.push(pond._id);
      await farmer.save();
    }

    res.status(200).json({ message: 'Pond assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign pond' });
  }
});