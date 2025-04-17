// backend/db.js
const sequelize = require('./config/database');
const User = require('./models/User');
const Client = require('./models/Client');
const Passager = require('./models/Passager');
const Entreprise = require('./models/Entreprise');
const Chauffeur = require('./models/Chauffeur');
const Voiture = require('./models/Voiture');
const TypeVoiture = require('./models/TypeVoiture');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
    
    await sequelize.sync({ alter: true });
    console.log('Base de données synchronisée.');

    // Insérer des types de voiture initiaux (exécuter une seule fois)
    const types = ['Berline', 'SUV', 'Minivan', 'Cabriolet'];
    for (const nom of types) {
      await TypeVoiture.findOrCreate({
        where: { nom },
        defaults: { nom },
      });
    }
    console.log('Types de voiture initialisés.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
    process.exit(1);
  }
}

module.exports = { sequelize, initializeDatabase };