require('dotenv').config();

const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise',
  jwtExpiresIn: '1h',
};

module.exports = authConfig;