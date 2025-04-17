module.exports = {
    up: async (queryInterface) => {
      await queryInterface.bulkInsert('TypeVoitures', [
        { nom: 'Berline', createdAt: new Date(), updatedAt: new Date() },
        { nom: 'SUV', createdAt: new Date(), updatedAt: new Date() },
        { nom: 'Citadine', createdAt: new Date(), updatedAt: new Date() },
        { nom: 'Van', createdAt: new Date(), updatedAt: new Date() },
      ]);
    },
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('TypeVoitures', null, {});
    },
  };