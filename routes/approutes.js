const express = require('express')
const { certingusers, loginusers, userdashboard } = require('../controllers/appcontroller')
const authorization = require('../middleware/authorisation')
const router =  express.Router()


router.post('/register',certingusers)
router.post('/login',loginusers)
router.get('/userdashboard',authorization,userdashboard)

module.exports = router