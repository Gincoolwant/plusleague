const express = require('express')
const path = require('path')

const auth = require('./modules/auth')
const users = require('./modules/user')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const renderIndex = require('../middleware/renderIndex')

const router = express.Router()

router.use('/users', users)
router.use('/auth', authenticated, auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/', renderIndex)
router.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../public', '404.html'))
})

module.exports = router
