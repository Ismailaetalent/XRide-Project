console.log('Chargement de typeVoitureService.js');
const { models } = require('../config/database');

class TypeVoitureService {

  static async initializeTypes() {
    console.log('Appel de initializeTypes'); // Log pour confirmer l'exécution
    const defaultTypes = [
      { nom: 'Berline' },
      { nom: 'SUV' },
      { nom: 'Citadine' },
      { nom: 'Van' },
    ];

    try {
      for (const type of defaultTypes) {
        const [record, created] = await models.TypeVoiture.findOrCreate({
          where: { nom: type.nom },
          defaults: {
            nom: type.nom,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        if (created) {
          console.log(`Type de voiture créé : ${type.nom}`);
        } else {
          console.log(`Type de voiture déjà existant : ${type.nom}`);
        }
      }
      console.log('Initialisation des types de voiture terminée.');
    } catch (error) {
      console.error('Erreur dans initializeTypes:', error);
      throw error;
    }
  }

  async create(data) {
    return await models.TypeVoiture.create(data);
  }

  async findAll() {
    return await models.TypeVoiture.findAll();
  }

  async findById(id) {
    return await models.TypeVoiture.findByPk(id);
  }

  async update(id, data) {
    const typeVoiture = await this.findById(id);
    if (!typeVoiture) throw new Error('TypeVoiture non trouvé');
    return await typeVoiture.update(data);
  }

  async delete(id) {
    const typeVoiture = await this.findById(id);
    if (!typeVoiture) throw new Error('TypeVoiture non trouvé');
    return await typeVoiture.destroy();
  }
}

module.exports = new TypeVoitureService();