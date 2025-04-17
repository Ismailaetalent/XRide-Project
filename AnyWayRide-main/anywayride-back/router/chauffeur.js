// routes/chauffeur.js
const express = require('express');
const auth = require('../middleware/auth');
const ChauffeurService = require('../services/ChauffeurService');
const router = express.Router();

router.post('/create', auth, async (req, res) => {
  if (req.user.role !== 'chauffeur') {
    return res.status(403).json({ error: 'Accès réservé aux chauffeurs' });
  }

  const { licence, voiture } = req.body;
  try {
    const chauffeur = await ChauffeurService.createChauffeur(req.user.id, licence, voiture);
    res.status(201).json(chauffeur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;