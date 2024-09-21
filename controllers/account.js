const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Account = require('../models/Account')


exports.createAccount = async (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.status = 422
        error.data = errors.array()
        return next(error)
    }
    try{
        const id = req.userId
        const {accountType, currency} = req.body
        const user = await User.findById(id).populate('accounts')
        if (!user) {
            const error = new Error('No User found');
            error.status = 404;
            return next(error);
        }
        const hasSaving = user.accounts.some(account => account.accountType === accountType)
        if(hasSaving){
            const error = new Error(`${accountType} account already exist`);
            error.status = 409;
            return next(error);
        }
        const account = new Account({
            accountType : accountType,
            currency : currency
        })
        const savedAccount = await account.save()
        user.accounts.push(savedAccount)
        await user.save()
        res.status(201).json({ message: 'Account created successfully' })

    }catch (err) {
        if(err.name === 'ValidationError'){
            err.message = 'AccountType error["SAVINGS" or "DEBIT"]'
            err.status = 400
        }
        
        if(!err.status)
            err.status = 500
        next(err); 
    }
}

exports.getAccount = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Wrong account number')
        error.status = 422
        error.data = errors.array()
        return next(error)
    }
    try {
        const id = req.userId
        const { accountNumber }  = req.body
        const user = await User.findById(id).populate({path : 'accounts'
            , match: {accountNumber : accountNumber}}) 
        if (!user) {
            const error = new Error('No User found');
            error.status = 404;
            return next(error);
        }
        if(!user.accounts.length){
            const error = new Error('No Account found');
            error.status = 404;
            return next(error);
        }
        const account = user.accounts[0]
        res.status(200).json({ account})
    } catch (error) {
        if(!err.status)
            err.status = 500
        next(err);
    }
    
}