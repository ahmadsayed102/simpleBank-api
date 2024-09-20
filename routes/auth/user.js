const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const User = require('../../models/User')

const authController = require('../../controllers/auth/user')
const isAuth = require('../../middleware/is-auth')

router.post('/register', [
    body('name').isAlpha().isLength({min: 2})  ,

    body('email').isEmail().normalizeEmail(),

    body('password').trim().isLength({min : 6})  ,

    body('country').isLength({min:1}).isAlpha() ,

    body('dateOfBirth').isDate()

], authController.register)

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()  ,
    body('password').trim().isLength({min : 6})
],authController.login)

router.get('/test', isAuth , authController.test)

exports.routes = router