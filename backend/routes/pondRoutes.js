const express = require('express');
const router = express.Router();
const Pond = require('./models/Pond');

// #description    Get all ponds
// #route   GET /api/ponds
router.get('/', async (req, res) => {
  try {
    const ponds = await Pond.find();
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// #description    Get a specific pond by id
// #route   GET /api/ponds/:id
router.get('/:id', async (req, res) => {
  try {
    const pond = await Pond.findById(req.params.id);
    if (!pond) {
      return res.status(404).json({ error: 'Pond not found' });
    }
    res.status(200).json(pond);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// #description    Get all ponds by farmer ID
// #route   GET /api/ponds/farmer/:farmerId
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const ponds = await Pond.find({ farmer: req.params.farmerId });
    if (ponds.length === 0) {
      return res.status(404).json({ error: 'No ponds found for this farmer' });
    }
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// #description    Get all ponds by location
// #route   GET /api/ponds/location/:location
router.get('/location/:location', async (req, res) => {
  try {
    const ponds = await Pond.find({ location: req.params.location });
    if (ponds.length === 0) {
      return res.status(404).json({ error: 'No ponds found in this location' });
    }
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// #description    Get ponds sorted by temperature
// #route   GET /api/ponds/sorted-by-temperature
router.get('/sorted-by-temperature', async (req, res) => {
  const { order = 'asc' } = req.query; // Default is ascending, but can be changed to 'desc'

  try {
    const ponds = await Pond.find().sort({ temperature: order === 'asc' ? 1 : -1 });
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// #description    Get ponds filtered by multiple conditions
// #route   GET /api/ponds/filter
router.get('/filter', async (req, res) => {
  const { minTemperature, maxTemperature, minOxygenLevel, maxOxygenLevel } = req.query;

  const filterConditions = {};

  if (minTemperature && maxTemperature) {
    filterConditions.temperature = { $gte: minTemperature, $lte: maxTemperature };
  }

  if (minOxygenLevel && maxOxygenLevel) {
    filterConditions.oxygenLevel = { $gte: minOxygenLevel, $lte: maxOxygenLevel };
  }

  try {
    const ponds = await Pond.find(filterConditions);
    if (ponds.length === 0) {
      return res.status(404).json({ error: 'No ponds found with the specified conditions' });
    }
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
