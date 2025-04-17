class ThirdPartyAuthInterface {
    async authenticate(data) {
      throw new Error('Method authenticate() must be implemented');
    }
  
    async getUserInfo(token) {
      throw new Error('Method getUserInfo() must be implemented');
    }
  }
  
  module.exports = ThirdPartyAuthInterface;