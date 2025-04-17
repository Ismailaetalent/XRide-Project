// backend/services/ChauffeurService.js
const Chauffeur = require('../models/Chauffeur');
const Voiture = require('../models/Voiture');
const TypeVoiture = require('../models/TypeVoiture');
const { sequelize } = require('../config/database');

class ChauffeurService {
  static async createChauffeur(userId, licence, voitureData) {
    const transaction = await sequelize.transaction();
    try {
      // Créer le chauffeur
      const chauffeur = await Chauffeur.create({ userId, licence }, { transaction });

      // Vérifier que voitureData est fourni
      if (!voitureData || !voitureData.immatriculation || !voitureData.modele || !voitureData.typeVoitureNom) {
        throw new Error('Les informations de la voiture sont requises pour un chauffeur.');
      }

      // Vérifier ou créer le type de voiture
      let typeVoiture = await TypeVoiture.findOne({
        where: { nom: voitureData.typeVoitureNom },
        transaction,
      });
      if (!typeVoiture) {
        typeVoiture = await TypeVoiture.create(
          { nom: voitureData.typeVoitureNom },
          { transaction }
        );
      }

      // Créer la voiture
      await Voiture.create({
        chauffeurId: userId,
        typeVoitureId: typeVoiture.id,
        immatriculation: voitureData.immatriculation,
        modele: voitureData.modele,
      }, { transaction });

      await transaction.commit();
      return chauffeur;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getChauffeurWithVoitures(userId) {
    return Chauffeur.findOne({
      where: { userId },
      include: [{ model: Voiture, include: [TypeVoiture] }],
    });
  }
}

module.exports = ChauffeurService;