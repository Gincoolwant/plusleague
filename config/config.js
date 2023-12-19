if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'plus_league',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  docker: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'plus_league',
    host: 'db',
    dialect: 'mysql'
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'plus_league_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'JAWSDB_MARIA_URL'
  },
  travis: {
    username: 'travis',
    database: 'plus_league_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
}
