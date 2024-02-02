const { createClient } = require('redis')

let redisInstance

(async function connectRedis () {
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
})()

const cache = {
  addExpireSet: async (key, expiredTime, value) => {
    return await redisInstance.setEx(key, expiredTime, JSON.stringify(value))
  },
  getSet: async (key) => {
    return await redisInstance.get(key)
  },
  flush: () => {
    redisInstance.flushDb()
  }
}

module.exports = {
  cache
}
