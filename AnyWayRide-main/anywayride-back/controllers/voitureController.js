const voitureService = require('../services/voitureService');

exports.create = async (req, res) => {
  try {
    const voiture = await voitureService.create(req.body);
    res.status(201).json(voiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const voitures = await voitureService.findAll();
    res.status(200).json(voitures);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const voiture = await voitureService.findById(req.params.id);
    if (!voiture) return res.status(404).json({ error: 'Voiture non trouvée' });
    res.status(200).json(voiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const voiture = await voitureService.update(req.params.id, req.body);
    res.status(200).json(voiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await voitureService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};