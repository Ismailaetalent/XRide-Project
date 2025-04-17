const ThirdPartyAuthInterface = require('./thirdPartyAuthInterface');

class FacebookAuthService extends ThirdPartyAuthInterface {
  async authenticate(data) {
    // Simulation de l'authentification Facebook
    return { token: 'mock_facebook_token', user: { email: data.email, name: data.name } };
  }

  async getUserInfo(token) {
    // Simulation de récupération des infos utilisateur
    return { email: 'mock@facebook.com', name: 'Mock Facebook User' };
  }
}

module.exports = FacebookAuthService;