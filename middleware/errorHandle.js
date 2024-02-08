const path = require('path')
const AppError = require('../utils/AppError')

module.exports = {
  errorLogger (err, req, res, next) {
    console.log(`Error: ${err.message}`)
    next(err)
  },
  errorResponder (err, req, res, next) {
    // Operational Error
    if (err instanceof AppError) {
      res.status(err.statusCode).send({
        error: err.errorCode
      })
    } else {
      // Unexpected Server Error
      res.status(500).send({
        error: '伺服器發生錯誤，請稍後重試或聯絡開發人員。'
      })
    }
  },
  invalidPathHandler (req, res, next) {
    res.status(404).sendFile(path.join(__dirname, '../public', '404.html'))
  }
}
