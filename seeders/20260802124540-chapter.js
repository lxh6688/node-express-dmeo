'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Chapters', [
      {
        courseId: 1,
        title: 'CSS 课程介绍',
        content: 'CSS课程内容',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 2,
        title: 'Node.js 课程介绍',
        content: 'Node.js课程内容',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 2,
        title: '安装 Node.js',
        content: 'Node.js课程内容',
        video: '',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapters', null, {});
  }
};
