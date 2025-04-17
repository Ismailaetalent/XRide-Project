module.exports = (sequelize, DataTypes) => {
    const Voiture = sequelize.define('Voiture', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marque: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modele: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      typeVoitureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Voiture.associate = (models) => {
      Voiture.belongsTo(models.User, { foreignKey: 'userId', as: 'proprietaire' });
      Voiture.belongsTo(models.TypeVoiture, { foreignKey: 'typeVoitureId', as: 'typeVoiture' });
    };
  
    return Voiture;
  };