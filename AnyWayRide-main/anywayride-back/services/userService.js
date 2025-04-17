const { models } = require('../config/database');

class UserService {
  async create(data) {
    // Validation selon le type
    if (data.typeUser === 'CHAUFFEUR' && !data.permis) {
      throw new Error('Le permis est requis pour un chauffeur');
    }
    if (data.typeUser === 'ADMIN' && !data.droits) {
      throw new Error('Les droits sont requis pour un admin');
    }
    return await models.User.create(data);
  }

  async findAll() {
    return await models.User.findAll();
  }

  async findById(id) {
    return await models.User.findByPk(id);
  }

  async update(id, data) {
    const user = await this.findById(id);
    if (!user) throw new Error('Utilisateur non trouvé');
    return await user.update(data);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) throw new Error('Utilisateur non trouvé');
    return await user.destroy();
  }

  // Méthodes spécifiques
  async proposerTrajet(userId, trajetData) {
    const user = await this.findById(userId);
    if (user.typeUser !== 'CHAUFFEUR') throw new Error('Seul un chauffeur peut proposer un trajet');
    // Logique pour créer un trajet (à implémenter)
    return { message: 'Trajet proposé', trajetData };
  }

  async moderer(userId, action) {
    const user = await this.findById(userId);
    if (user.typeUser !== 'ADMIN') throw new Error('Seul un admin peut modérer');
    // Logique de modération (ex. : bloquer un utilisateur)
    return { message: 'Action modérée', action };
  }

  async reserverTrajet(userId, trajetId) {
    const user = await this.findById(userId);
    if (user.typeUser !== 'PASSAGER') throw new Error('Seul un passager peut réserver un trajet');
    // Logique pour réserver un trajet (à implémenter)
    return { message: 'Trajet réservé', trajetId };
  }
}

module.exports = new UserService();