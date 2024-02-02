const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/matches', adminController.getMatchesFromNow)
router.get('/users', adminController.getAllUser)
router.delete('/matches/:id', adminController.delistMatch)
router.patch('/matches/:id', adminController.listMatch)

module.exports = router
