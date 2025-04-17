const ThirdPartyAuthInterface = require('./thirdPartyAuthInterface');

class TwilioAuthService extends ThirdPartyAuthInterface {
  async authenticate(data) {
    // Simulation de l'authentification Twilio (ex. : SMS OTP)
    return { token: 'mock_twilio_token', user: { phone: data.phone } };
  }

  async getUserInfo(token) {
    // Simulation de récupération des infos utilisateur
    return { phone: '+1234567890' };
  }
}

module.exports = TwilioAuthService;