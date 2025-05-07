const express = require('express');
const router = express.Router();
const Pond = require('../models/pond');
const Farmer = require('../models/farmerSchema');

// Utility to validate required fields
const isMissing = (fields) => {
  return Object.entries(fields).filter(([_, v]) => !v);
};

// @route   POST /api/ponds/farmer
// @desc    Create a new farmer
router.post('/farmer', async (req, res) => {
  try {
    const { name, email } = req.body;

    const missing = isMissing({ name, email });
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.map(([k]) => k).join(', ')}` });
    }

    const farmer = new Farmer({ name, email });
    await farmer.save();

    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create farmer', details: err.message });
  }
});

// @route   POST /api/ponds/
// @desc    Create a new pond and assign to farmer
router.post('/', async (req, res) => {
  try {
    const { name, location, temperature, ph, oxygenLevel, farmerId } = req.body;

    const missing = isMissing({ name, location, farmerId });
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.map(([k]) => k).join(', ')}` });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const pond = new Pond({
      name,
      location,
      temperature: temperature || 0,
      ph: ph || 7.0,
      oxygenLevel: oxygenLevel || 0,
      farmer: farmerId,
    });

    await pond.save();

    farmer.ponds.push(pond._id);
    await farmer.save();

    res.status(201).json(pond);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pond', details: err.message });
  }
});

// @route   POST /api/ponds/multi
// @desc    Create multiple ponds for one farmer
router.post('/multi', async (req, res) => {
  try {
    const { ponds, farmerId } = req.body;

    if (!Array.isArray(ponds) || ponds.length === 0) {
      return res.status(400).json({ error: 'Ponds must be a non-empty array' });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

    const createdPonds = await Pond.insertMany(
      ponds.map(p => ({
        name: p.name,
        location: p.location,
        temperature: p.temperature || 0,
        ph: p.ph || 7.0,
        oxygenLevel: p.oxygenLevel || 0,
        farmer: farmerId
      }))
    );

    farmer.ponds.push(...createdPonds.map(p => p._id));
    await farmer.save();

    res.status(201).json(createdPonds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create multiple ponds', details: err.message });
  }
});

// @route   POST /api/ponds/farmer/:id/assign-pond
// @desc    Assign an existing pond to a farmer
router.post('/farmer/:id/assign-pond', async (req, res) => {
  try {
    const { pondId } = req.body;
    const farmer = await Farmer.findById(req.params.id);
    const pond = await Pond.findById(pondId);

    if (!farmer || !pond) {
      return res.status(404).json({ error: 'Farmer or Pond not found' });
    }

    pond.farmer = farmer._id;
    await pond.save();

    if (!farmer.ponds.includes(pond._id)) {
      farmer.ponds.push(pond._id);
      await farmer.save();
    }

    res.status(200).json({ message: 'Pond assigned successfully', pond });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign pond', details: err.message });
  }
});

module.exports = router;
