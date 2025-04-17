const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../config/database');

class AuthService {
  static async signup(payload) {
    const { nom, email, motDePasse, typeUser, permis, droits, dateNaissance, voitures } = payload;

    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const user = await models.User.create({
      nom,
      email,
      motDePasse: hashedPassword,
      typeUser,
      permis: typeUser === 'CHAUFFEUR' ? permis : null,
      droits: typeUser === 'ADMIN' ? droits : null,
      dateNaissance: typeUser === 'PASSAGER' ? dateNaissance : null,
    });

    if (typeUser === 'CHAUFFEUR' && voitures && voitures.length > 0) {
      for (const voiture of voitures) {
        await models.Voiture.create({
          marque: voiture.marque,
          modele: voiture.modele,
          userId: user.id,
          typeVoitureId: voiture.typeVoitureId,
        });
      }
    }

    const token = jwt.sign({ id: user.id, typeUser }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }

  static async login(email, motDePasse) {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      throw new Error('Mot de passe incorrect');
    }

    const token = jwt.sign({ id: user.id, typeUser: user.typeUser }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }
}

module.exports = AuthService;