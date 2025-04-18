const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const userController = require('../controllers/user')
const validationMiddleware = require('../middleware/validationMiddleware')

const isAuth =  require('../middleware/is-auth')

router.get('/getUser', isAuth, userController.getUser)
router.post('/addFavourite',[
    body('name').isAlpha().isLength({min:1}).withMessage('Invalid name'),
    body('accountNumber').isNumeric().isLength({min:1}).withMessage('Invalid account number!')
]
    ,validationMiddleware, isAuth, userController.addFavourite)
router.post('/deleteFavourite',[
        body('name').isAlpha().isLength({min:1}).withMessage('Invalid name')
    ]
        ,validationMiddleware, isAuth, userController.deleteFavourite)

exports.routes = router
