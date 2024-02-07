const express = require('express')

const adminController = require('../../controllers/admin-controller')
const tryCatch = require('../../utils/tryCatch')

const router = express.Router()

router.get('/matches', tryCatch(adminController.getMatchesFromNow))
router.get('/users', tryCatch(adminController.getAllUser))
router.delete('/matches/:id', tryCatch(adminController.delistMatch))
router.patch('/matches/:id', tryCatch(adminController.listMatch))

module.exports = router
