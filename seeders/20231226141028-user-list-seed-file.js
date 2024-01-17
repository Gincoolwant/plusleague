'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userList = [
      {
        name: '使用者初代目',
        email: 'user1@example.com',
        password: '123',
        is_admin: 'user',
        g_token: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '管理者1號',
        email: 'admin@example.com',
        password: '123',
        is_admin: 'admin',
        g_token: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    await queryInterface.bulkInsert('Users', userList, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
