const fs = require('fs')
const imgur = require('imgur')

// 將接收上傳在temp的檔案移轉到對外資料夾upload
const localFileHandler = async (file) => {
  if (!file) return null
  const fileName = `upload/${file.originalname}`
  try {
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    console.log('pic ok')
    return `/${fileName}`
  } catch (err) {
    return err
  }
}

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

module.exports = {
  localFileHandler
}
