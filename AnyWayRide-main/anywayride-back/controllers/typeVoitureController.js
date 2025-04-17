//const typeVoitureService = require('.../services/typeVoitureService');
const typeVoitureService = require('../services/typeVoitureService');

exports.create = async (req, res) => {
  try {
    const typeVoiture = await typeVoitureService.create(req.body);
    res.status(201).json(typeVoiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const typeVoitures = await typeVoitureService.findAll();
    res.status(200).json(typeVoitures);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const typeVoiture = await typeVoitureService.findById(req.params.id);
    if (!typeVoiture) return res.status(404).json({ error: 'TypeVoiture non trouvé' });
    res.status(200).json(typeVoiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const typeVoiture = await typeVoitureService.update(req.params.id, req.body);
    res.status(200).json(typeVoiture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await typeVoitureService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};