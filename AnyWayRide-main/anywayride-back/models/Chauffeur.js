// models/Chauffeur.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Chauffeur extends Model {}
Chauffeur.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  licence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Chauffeur',
  tableName: 'chauffeurs',
  timestamps: true,
});

User.hasOne(Chauffeur, { foreignKey: 'userId' });
Chauffeur.belongsTo(User, { foreignKey: 'userId' });
module.exports = Chauffeur;