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
      Match.belongsTo(models.Team, { foreignKey: 'guestId', as: 'guest' })
      Match.belongsTo(models.Team, { foreignKey: 'homeId', as: 'home' })
    }
  }
  Match.init({
    type: DataTypes.STRING,
    gameId: DataTypes.STRING,
    gameTime: DataTypes.DATE,
    arena: DataTypes.STRING,
    guestId: DataTypes.INTEGER,
    homeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Match',
    tableName: 'Matches',
    deletedAt: 'deletedAt',
    paranoid: true,
    timestamps: true,
    underscored: true
  })
  return Match
}
