const ThirdPartyAuthInterface = require('./thirdPartyAuthInterface');

class GoogleAuthService extends ThirdPartyAuthInterface {
  async authenticate(data) {
    // Simulation de l'authentification Google OAuth2
    return { token: 'mock_google_token', user: { email: data.email, name: data.name } };
  }

  async getUserInfo(token) {
    // Simulation de récupération des infos utilisateur
    return { email: 'mock@google.com', name: 'Mock Google User' };
  }
}

module.exports = GoogleAuthService;