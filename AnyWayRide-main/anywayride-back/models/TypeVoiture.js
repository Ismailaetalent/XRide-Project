module.exports = (sequelize, DataTypes) => {
    const TypeVoiture = sequelize.define('TypeVoiture', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    TypeVoiture.associate = (models) => {
      TypeVoiture.hasMany(models.Voiture, { foreignKey: 'typeVoitureId', as: 'voitures' });
    };
  
    return TypeVoiture;
  };