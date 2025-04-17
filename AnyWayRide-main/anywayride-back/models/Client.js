// models/Client.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Client extends Model {}
Client.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('passager', 'entreprise'),
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients',
  timestamps: true,
});

User.hasOne(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });
module.exports = Client;