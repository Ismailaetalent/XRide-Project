const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token requis' });

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded; // Ajouter les infos utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;