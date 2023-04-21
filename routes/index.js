const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const users = require('./modules/user')
const admin = require('./modules/admin')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const renderIndex = require('../middleware/renderIndex')
const { errorHandler } = require('../middleware/errorHandle')

router.use('/users', users)
router.use('/auth', authenticated, auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/', renderIndex)
router.use('/', errorHandler)

module.exports = router
