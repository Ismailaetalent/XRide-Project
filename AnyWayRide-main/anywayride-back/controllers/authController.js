const authService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const result = await authService.login(email, motDePasse);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.thirdPartyLogin = async (req, res) => {
  try {
    const { provider, data } = req.body;
    const result = await authService.thirdPartyLogin(provider, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};