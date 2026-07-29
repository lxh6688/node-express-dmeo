'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@xh.cn',
        username: 'admin',
        password: '123456',
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user1@xh.cn',
        username: 'user1',
        password: '123123',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user2@xh.cn',
        username: 'user2',
        password: '123123',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user3@xh.cn',
        username: 'user3',
        password: '123123',
        sex: 1,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
