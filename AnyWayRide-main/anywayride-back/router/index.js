const express = require('express');
const router = express.Router();
const typeVoitureController = require('../controllers/typeVoitureController');
const voitureController = require('../controllers/voitureController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/third-party-login', authController.thirdPartyLogin);

router.post('/type-voitures', authMiddleware, typeVoitureController.create);
router.get('/type-voitures', typeVoitureController.findAll); // Accessible sans auth pour inscription
router.get('/type-voitures/:id', authMiddleware, typeVoitureController.findById);
router.put('/type-voitures/:id', authMiddleware, typeVoitureController.update);
router.delete('/type-voitures/:id', authMiddleware, typeVoitureController.delete);

router.post('/voitures', authMiddleware, voitureController.create);
router.get('/voitures', authMiddleware, voitureController.findAll);
router.get('/voitures/:id', authMiddleware, voitureController.findById);
router.put('/voitures/:id', authMiddleware, voitureController.update);
router.delete('/voitures/:id', authMiddleware, voitureController.delete);

router.post('/users', authMiddleware, userController.create);
router.get('/users', authMiddleware, userController.findAll);
router.get('/users/:id', authMiddleware, userController.findById);
router.put('/users/:id', authMiddleware, userController.update);
router.delete('/users/:id', authMiddleware, userController.delete);
router.post('/users/:userId/proposer-trajet', authMiddleware, userController.proposerTrajet);
router.post('/users/:userId/moderer', authMiddleware, userController.moderer);
router.post('/users/:userId/reserver-trajet', authMiddleware, userController.reserverTrajet);

module.exports = router;