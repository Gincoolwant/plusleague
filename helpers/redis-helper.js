const { createClient } = require('redis')

let redisInstance

async function connectRedis () {
  if (!redisInstance) {
    const redisOptions = { url: process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : '' }
    redisInstance = await createClient(redisOptions)
    redisInstance.on('connect', () => {
      console.log('Connected to Redis server')
    })

    redisInstance.on('error', err => {
      console.error('Error connecting to Redis:', err)
      throw new Error(`Redis Client Error: ${err}`)
    })
    redisInstance.connect()
  }

  return redisInstance
}

async function setRedisExpireString (redisClient, key, expiredTime, value) {
  return await redisClient.setEx(key, expiredTime, JSON.stringify(value))
}

async function getRedisString (redisClient, key) {
  return await redisClient.get(key)
}

module.exports = {
  connectRedis,
  getRedisString,
  setRedisExpireString
}
