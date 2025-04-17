// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Client = require('../models/Client');
const ChauffeurService = require('../services/ChauffeurService');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret';

// Inscription
router.post('/register', async (req, res) => {
  const { email, password, role, nom, type, licence, voiture } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    if (role === 'client') {
      await Client.create({ userId: user.id, nom, type });
    } else if (role === 'chauffeur') {
      await ChauffeurService.createChauffeur(user.id, licence, voiture);
    }

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;