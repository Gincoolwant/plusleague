const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const user = require('./modules/user')
const axios = require('axios')
const cheerio = require('cheerio')

router.use('/auth', auth)
router.use('/users', user)

router.get('/', (req, res) => {
  axios.get('https://pleagueofficial.com/schedule-regular-season/2022-23')
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
      const matches = $('.match_row.is-future').map((index, el) => {
        const result = {
          id: Number($(el).find('.fs14.mb-2').text().slice(1)),
          date: $(el).find('.match_row_datetime').find('h5').eq(0).text(),
          day: $(el).find('.match_row_datetime').find('h5').eq(1).text(),
          time: $(el).find('.match_row_datetime').find('h6').text(),
          arena: $(el).find('.fs12.mb-0').text(),
          guest: {
            logo: $(el).find('.px-0').eq(0).find('img').attr('src'),
            name: $(el).find('.px-0').eq(0).find('.PC_only.fs14').text(),
            englishName: $(el).find('.px-0').eq(0).find('.fs12.PC_only').eq(1).text()
          },
          home: {
            logo: $(el).find('.px-0').eq(2).find('img').attr('src'),
            name: $(el).find('.px-0').eq(2).find('.PC_only.fs14').text(),
            englishName: $(el).find('.px-0').eq(2).find('.fs12.PC_only').eq(1).text()
          }
        }
        return result
      }).get()
      res.render('index', { matches })
    })
    .catch((err) => console.log(err))
})

module.exports = router
