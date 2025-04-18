const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const accountController = require('../controllers/account')
const isAuth = require('../middleware/is-auth')
const validationMiddleware = require('../middleware/validationMiddleware')


router.post('/createAccount' , [
    body('currency').isAlpha().isLength({ min: 1 }).withMessage('Invalid currency'),
    body('accountType').isAlpha().isLength({ min: 3 }).withMessage('Invalid account type')
],isAuth ,  accountController.createAccount)
router.get('/getAccount', [
    body('accountNumber').isNumeric().isLength({ min: 1 }).withMessage('Invalid Account number')
],validationMiddleware, isAuth, accountController.getAccount)

exports.routes = router