const express = require('express')
const { certingusers, loginusers, userdashboard, refresh, passwormanager, allpassword } = require('../controllers/appcontroller')
const authorization = require('../middleware/authorisation')
const router =  express.Router()


router.post('/register',certingusers)
router.post('/login',loginusers)
router.get('/dashboard',authorization,userdashboard)
router.post('/refresh',authorization,refresh)
router.post('/addnewpassword',authorization,passwormanager)
router.get('/allpassword',authorization,allpassword)
module.exports = router