const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');

const authController = require('../../controllers/auth/user')
const isAuth = require('../../middleware/is-auth')

router.post('/register', [
    body('name').isAlpha().isLength({ min: 2 }).withMessage('Name must contain only letters and be at least 2 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('country').isLength({ min: 1 }).isAlpha().withMessage('Country must contain only letters'),
    body('dateOfBirth').isDate().withMessage('Please provide a valid date of birth')
], authController.register);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()  ,
    body('password').trim().isLength({min : 6})
],authController.login)

router.get('/test', isAuth , authController.test)

exports.routes = router