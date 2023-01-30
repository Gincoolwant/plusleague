'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Team.hasMany(models.Match, { foreignKey: 'guestId' })
      Team.hasMany(models.Match, { foreignKey: 'homeId' })
    }
  }
  Team.init({
    teamId: DataTypes.INTEGER,
    logo: DataTypes.STRING,
    name: DataTypes.STRING,
    englishName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'Teams',
    underscored: true
  })
  return Team
}
