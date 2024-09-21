const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth/user')

const isAuth =  require('../middleware/is-auth')

router.get('/getUser', isAuth, authController.getUser)

exports.routes = router
