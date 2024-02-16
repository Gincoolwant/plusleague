const fs = require('fs')
const path = require('path')
const { ImgurClient } = require('imgur')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 將接收上傳在temp的檔案移轉到對外資料夾upload
const localFileHandler = async (file) => {
  if (!file) return null
  const fileName = `upload/${file.originalname}`
  try {
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    return `/${fileName}`
  } catch (err) {
    return err
  }
}

const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN
})
const imgurFileHandler = async (file) => {
  if (!file) return null
  try {
    const img = await client.upload({
      image: fs.createReadStream(path.join(__dirname, '../', file.path)),
      type: 'stream',
      title: file.originalname,
      album: process.env.IMGUR_ALBUM_ID,
      description: `User upload avatar.${file.originalname}`
    })
    return img?.data.link || null
  } catch (err) {
    return err
  }
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
