if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  docker: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: 'db',
    dialect: 'mysql'
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_TEST,
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'JAWSDB_MARIA_URL' // heroku aad-ons mysql database
  }
}
