module.exports = {
  errorHandler (err, res) {
    if (err instanceof Error) {
      console.log(err.message)
      res.status(err.status || 500).json({
        status: 'error',
        message: '伺服器發生錯誤，請稍後重試或聯絡開發人員。'
      })
    } else {
      console.log(err.message)
      res.status(501).json({
        status: 'error',
        message: '未預期的錯誤'
      })
    }
  }
}
