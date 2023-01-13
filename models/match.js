'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  match.init({
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
  return match
}
