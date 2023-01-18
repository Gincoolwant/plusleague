'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teams = [
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_1_1605758005.png',
        name: '勇士',
        english_name: 'Taipei Fubon Braves',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_2_1665046121.png',
        name: '領航猿',
        english_name: 'Taoyuan Pauian Pilots',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_3_1607584510.png',
        name: '攻城獅',
        english_name: 'Hsinchu Jko Lioneers',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_4_1605758051.png',
        name: '夢想家',
        english_name: 'Formosa Taishin Dreamers',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_5_1665644838.png',
        name: '鋼鐵人',
        english_name: 'Kaohsiung 17LIVE Steelers',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        logo: '//d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_5_1632361561.png',
        name: '國王',
        english_name: 'New Taipei Kings',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    await queryInterface.bulkInsert('Teams', teams, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teams', {})
  }
}
