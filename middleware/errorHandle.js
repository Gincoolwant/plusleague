module.exports = {
  errorHandler (err, req, res, next) {
    console.error(err)
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: '伺服器發生錯誤，請稍後重試或聯絡開發人員。'
      })
    } else {
      res.status(501).json({
        status: 'error',
        message: '未預期的錯誤'
      })
    }
  }
}
