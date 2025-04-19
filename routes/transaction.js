const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const transactionController = require('../controllers/transactionController')
const isAuth = require('../middleware/is-auth')
const validationMiddleware = require('../middleware/validationMiddleware')

router.post('/transfer', [
    body('fromAcct').isInt().withMessage('Invalid Sender Account').toInt(),
    body('toAcct').isInt().withMessage('Invalid receiver Account').toInt(),
    body('amount').isFloat({ gt: 0 }).withMessage('Invalid amount').toFloat()
], validationMiddleware, isAuth, transactionController.transaction)

router.post('/updateBalance', [
    body('accountNum').isInt().withMessage('Invalid Account').toInt(),
    body('amount').isFloat().withMessage('Invalid amount').toFloat()
], validationMiddleware, isAuth, transactionController.updateBalance)
exports.routes = router