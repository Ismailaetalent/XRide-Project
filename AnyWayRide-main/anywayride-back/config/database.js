require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

try {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  });

  const models = {
    User: require('../models/User')(sequelize, DataTypes),
    Voiture: require('../models/Voiture')(sequelize, DataTypes),
    TypeVoiture: require('../models/TypeVoiture')(sequelize, DataTypes),
  };

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  module.exports = { sequelize, models };
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Sequelize:', error);
  throw error;
}