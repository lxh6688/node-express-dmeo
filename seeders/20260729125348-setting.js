'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Settings', [{
      name: '百度',
      icp: '京ICP证030173号',
      copyright: '©1999-2026 China Mobile. All Rights Reserved.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {});
  }
};
