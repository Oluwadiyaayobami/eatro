const express = require('express')
const { certingusers, loginusers, userdashboard, refresh } = require('../controllers/appcontroller')
const authorization = require('../middleware/authorisation')
const router =  express.Router()


router.post('/register',certingusers)
router.post('/login',loginusers)
router.get('/dashboard',authorization,userdashboard)
router.post('/refresh',authorization,refresh)
module.exports = router