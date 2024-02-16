const express = require('express')
const path = require('path')

const auth = require('./modules/auth')
const user = require('./modules/user')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const renderIndex = require('../middleware/renderIndex')
const { invalidPathHandler } = require('../middleware/errorHandle')

const router = express.Router()

router.use('/upload', express.static(path.join(__dirname, '../upload')))
router.use('/users', user)
router.use('/auth', authenticated, auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/', renderIndex)
router.use(invalidPathHandler)

module.exports = router
