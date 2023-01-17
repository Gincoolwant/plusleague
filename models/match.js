'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Match.belongsTo(models.Team, { foreignKey: 'guestId' })
      Match.belongsTo(models.Team, { foreignKey: 'homeId' })
    }
  }
  Match.init({
    gameId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    day: DataTypes.STRING,
    time: DataTypes.STRING,
    arena: DataTypes.STRING,
    guestId: DataTypes.INTEGER,
    homeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Match',
    tableName: 'Matches',
    underscored: true
  })
  return Match
}
