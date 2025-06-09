const express = require('express');
const router = express.Router();
const Pond = require('../models/pond');
const Farmer = require('../models/farmerSchema');

// Update a Farmer by ID
router.put('/farmer/:id', async (req, res) => {
  try {
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFarmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.status(200).json(updatedFarmer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update farmer' });
  }
});

// Update a Pond by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedPond = await Pond.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPond) {
      return res.status(404).json({ error: 'Pond not found' });
    }
    res.status(200).json(updatedPond);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pond' });
  }
});

// Update only temperature of a Pond
router.put('/:id/temperature', async (req, res) => {
  try {
    const { temperature } = req.body;
    const pond = await Pond.findById(req.params.id);
    if (!pond) return res.status(404).json({ error: 'Pond not found' });

    pond.temperature = temperature;
    await pond.save();
    res.status(200).json(pond);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update temperature' });
  }
});

// Reassign a pond to a new farmer
router.put('/:pondId/change-farmer', async (req, res) => {
  try {
    const { newFarmerId } = req.body;
    const pond = await Pond.findById(req.params.pondId);
    if (!pond) return res.status(404).json({ error: 'Pond not found' });

    const oldFarmer = await Farmer.findById(pond.farmer);
    const newFarmer = await Farmer.findById(newFarmerId);
    if (!newFarmer) return res.status(404).json({ error: 'New farmer not found' });

    // Remove from old farmer
    if (oldFarmer) {
      oldFarmer.ponds.pull(pond._id);
      await oldFarmer.save();
    }

    // Assign to new farmer
    pond.farmer = newFarmer._id;
    await pond.save();

    newFarmer.ponds.push(pond._id);
    await newFarmer.save();

    res.status(200).json({ message: 'Pond reassigned to new farmer' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reassign pond' });
  }
});

module.exports = router;