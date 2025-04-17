const express = require('express');
const TypeVoiture = require('../models/TypeVoiture');
const router = express.Router();

// GET /api/type-voitures - Récupérer tous les types de voiture
router.get('/', async (req, res) => {
  try {
    const types = await TypeVoiture.findAll({
      attributes: ['id', 'nom'],
      order: [['nom', 'ASC']],
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des types de voiture' });
  }
});

module.exports = router;