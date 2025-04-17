module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeUser: {
        type: DataTypes.ENUM('CHAUFFEUR', 'ADMIN', 'PASSAGER'),
        allowNull: false,
      },
      permis: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      droits: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      dateNaissance: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  
    User.associate = (models) => {
      User.hasMany(models.Voiture, { foreignKey: 'userId', as: 'voitures' });
    };
  
    return User;
  };