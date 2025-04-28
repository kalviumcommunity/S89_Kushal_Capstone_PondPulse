const express = require('express');
const router = express.Router();
const Pond = require('../models/pond');
const Farmer = require('../models/farmerSchema');

// Helper to safely parse float
const toFloat = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
};

// ✅ 1. Get all ponds
// GET /api/ponds
router.get('/', async (req, res) => {
  try {
    const ponds = await Pond.find();
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Get all farmers
// GET /api/ponds/farmer
router.get('/farmer', async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. Get a specific farmer by ID, with ponds populated
// GET /api/ponds/farmer/:farmerId
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = await Farmer.findById(farmerId).populate('ponds');

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.status(200).json(farmer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 4. Get ponds by location
// GET /api/ponds/location/:location
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

// ✅ 5. Get ponds sorted by temperature
// GET /api/ponds/sorted-by-temperature?order=asc|desc
router.get('/sorted-by-temperature', async (req, res) => {
  const { order = 'asc' } = req.query;
  try {
    const ponds = await Pond.find().sort({ temperature: order === 'asc' ? 1 : -1 });
    res.status(200).json(ponds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 6. Filter ponds by temp and oxygen
// GET /api/ponds/filter?minTemperature=20&maxTemperature=30&minOxygenLevel=3&maxOxygenLevel=6
router.get('/filter', async (req, res) => {
  const { minTemperature, maxTemperature, minOxygenLevel, maxOxygenLevel } = req.query;

  const filterConditions = {};
  const minTemp = toFloat(minTemperature);
  const maxTemp = toFloat(maxTemperature);
  const minO2 = toFloat(minOxygenLevel);
  const maxO2 = toFloat(maxOxygenLevel);

  if (minTemp !== undefined && maxTemp !== undefined) {
    filterConditions.temperature = { $gte: minTemp, $lte: maxTemp };
  }

  if (minO2 !== undefined && maxO2 !== undefined) {
    filterConditions.oxygenLevel = { $gte: minO2, $lte: maxO2 };
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

// ✅ 7. Get pond by ID
// GET /api/ponds/:id
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

module.exports = router;
