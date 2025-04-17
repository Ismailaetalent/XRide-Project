const { models } = require('../config/database');

class VoitureService {
  async create(data) {
    return await models.Voiture.create(data);
  }

  async findAll() {
    return await models.Voiture.findAll({
      include: [{ model: models.TypeVoiture, as: 'typeVoiture' }],
    });
  }

  async findById(id) {
    return await models.Voiture.findByPk(id, {
      include: [{ model: models.TypeVoiture, as: 'typeVoiture' }],
    });
  }

  async update(id, data) {
    const voiture = await this.findById(id);
    if (!voiture) throw new Error('Voiture non trouvée');
    return await voiture.update(data);
  }

  async delete(id) {
    const voiture = await this.findById(id);
    if (!voiture) throw new Error('Voiture non trouvée');
    return await voiture.destroy();
  }
}

module.exports = new VoitureService();