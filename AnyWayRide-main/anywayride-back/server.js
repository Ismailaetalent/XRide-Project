const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const routes = require('./router');

// Importation sécurisée de TypeVoitureService
let TypeVoitureService;
try {
  TypeVoitureService = require('./services/typeVoitureService');
  console.log('TypeVoitureService chargé:', TypeVoitureService);
  console.log('TypeVoitureService.initializeTypes:', TypeVoitureService.initializeTypes);
} catch (error) {
  console.error('Erreur lors du chargement de TypeVoitureService:', error);
  TypeVoitureService = null;
}

const app = express();

// Configuration CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

try {
  console.log('Enregistrement des routes...');
  app.use('/api', routes);
  console.log('Routes enregistrées avec succès.');
} catch (error) {
  console.error('Erreur lors de l\'enregistrement des routes:', error);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

if (!sequelize) {
  console.error('Erreur: l\'instance Sequelize n\'est pas définie.');
  process.exit(1);
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
    return sequelize.sync({ force: false });
  })
  .then(async () => {
    console.log('Tentative d\'initialisation des types de voiture...');
    if (!TypeVoitureService || typeof TypeVoitureService.initializeTypes !== 'function') {
      console.error('Erreur: TypeVoitureService ou initializeTypes non défini');
      console.log('Exécution de l\'initialisation inline comme secours...');
      // Logique inline comme secours
      const defaultTypes = [
        { nom: 'Berline' },
        { nom: 'SUV' },
        { nom: 'Citadine' },
        { nom: 'Van' },
      ];
      try {
        for (const type of defaultTypes) {
          const [record, created] = await sequelize.models.TypeVoiture.findOrCreate({
            where: { nom: type.nom },
            defaults: {
              nom: type.nom,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          console.log(created ? `Type créé : ${type.nom}` : `Type existant : ${type.nom}`);
        }
        console.log('Initialisation inline terminée.');
      } catch (error) {
        console.error('Erreur dans l\'initialisation inline:', error);
      }
    } else {
      await TypeVoitureService.initializeTypes();
      console.log('Types de voiture initialisés via TypeVoitureService.');
    }
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT} malgré l\'erreur`);
    });
  });

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});